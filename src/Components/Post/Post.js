import React, { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./Post.css";
import { Link } from "react-router-dom";
import Comment from "../Comment/Comment";
import { useLocation } from 'react-router-dom';
import CommentForm from "../Comment/CommentForm";
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    variants: [
      {
        props: ({ expand }) => !expand,
        style: {
          transform: 'rotate(0deg)',
        },
      },
      {
        props: ({ expand }) => !!expand,
        style: {
          transform: 'rotate(180deg)',
        },
      },
    ],
  }));
  
  
function Post({title, text, date, likes, postId, userId, userName}){  //post ile alakalı bilgiler buradan alınacak
    const [expanded, setExpanded] = React.useState(false);
    const [liked, setLiked] = React.useState(false);
    const [commentList, setCommentList] = React.useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);
    
    const user = localStorage.getItem('user');
    const userLogin = JSON.parse(user);
      

    const handleLikeClick = () => {
        setLiked(!liked);
        if(liked){
          
          setLikeCount(likeCount - 1);
          deleteLike();
          setLikeId(null);
          
        }
        else{
          
          setLikeCount(likeCount + 1);
          saveLike();
          
        }
    }


   



    useEffect(() => {checkLikes()

    },[])  

    const checkLikes = () => {
        var likeControl = likes.find((like) => like.userId === userLogin.id);
        if(likeControl != null){
          setLikeId(likeControl.id);
          setLiked(true);
          
        }
    }

    const saveLike = async (e) => {
      
        const payload = {
          userId: userLogin.id,    //TODO: user id buradan alınacak
          postId: postId
        };
    
        try {
          const response = await fetch('https://bulutbilisim-hansocial-app-74713540368.us-central1.run.app/likes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log('Response from server:', data);
          alert('Like başarıyla kaydedildi!');
          setLikeId(data.id);
        } catch (error) {
          console.error('Error posting data:', error);
          alert('Failed to post like');
        }
      
  };
  const deleteLike = () => {
    fetch("https://bulutbilisim-hansocial-app-74713540368.us-central1.run.app/likes/"+likeId, {
      method: "DELETE"
    }) 
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP hata: ${response.status}`);
      }
    
    console.log("Like geri çekildi");
    alert("Like geri çekildi");
    })
    .catch((error) => {
      console.error('Error posting data:', error);
      alert('Failed to delete like');
    });


  }

    const handleExpandClick = () => {
      setExpanded(!expanded);
      refreshComments();
    };

    const refreshComments = () => {
      fetch("https://bulutbilisim-hansocial-app-74713540368.us-central1.run.app/comments?postId="+postId)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bir hata oluştu!");
        }
        return response.json(); // JSON formatına dönüştür
      })
      .then((data) => {
        setIsLoaded(true);
        setCommentList(data); 

      })
      .catch((error) => {
           setIsLoaded(true);
           setError(error);
      });
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      refreshComments();
    }
  }, []);

 



    return (
      <Card sx={{ maxWidth: 800 }} className="container">
        <CardHeader
          avatar={
           <Link to={{pathname: "/users/"+userId}}> <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"> 
              {userName.substring(0,1)}
         </Avatar></Link>
         
        }
      
          
          action={
            <Typography >
              <Link style={{textDecoration: 'none', color: 'black', marginRight: '10px'}} to={{pathname: "/users/"+userId}}> {userName} </Link>
          </Typography>
          }
          
          title={
          <Link style={{textDecoration: 'none', color: 'black', fontWeight: 'bolder'}} to={{pathname: "/users/"+userId}}> {title} </Link>}
          subheader={date}
        />
    
        <CardContent>
      
          <Typography variant="body2" sx={{ color: 'text.primary', margin: '10px'}}>
            {text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleLikeClick} >
            <FavoriteIcon  style={{color: liked ? "red" : "black"}}/>
          </IconButton>
          {likeCount}
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {
            commentList.map((comment) => (
              <Comment id={comment.id} userId={comment.userId} userName={comment.userName} text={comment.text} />
            ))
          }
          <CommentForm postId={postId} userId={userLogin.id} refreshComments={refreshComments} />
        </Collapse>
      </Card>
    );
}

export default Post;  