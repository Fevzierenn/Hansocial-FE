import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Post.css";
import { Link } from "react-router-dom";

  
  
function PostForm({title, text, userId,userName, refreshPosts, avatar}){
    const [stitle, setTitle] = React.useState(title);
    const [stext, setText] = React.useState(text);


    const handlePost = async (e) => {
        console.log("Post clicked text: " + stext + " title: " + stitle);  
       
        if(stext.length > 0 && stitle.length > 0){
          const payload = {
            userId: userId,
            title: stitle,
            text: stext,
          };
      
          try {
            const response = await fetch('https://bulutbilisim-hansocial-app-74713540368.us-central1.run.app/posts', {
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
            alert('Post başarıyla paylaşıldı!');
           
            setText("");
            setTitle("");
            window.location.reload();
      
          } catch (error) {
            console.error('Error posting data:', error);
            alert('Failed to post data');
          }
        }
        else{
          alert("Post ya da başlık boş olamaz!");
        }
    };

    const handleSubmit = () => {
        handlePost();
        refreshPosts();
    }


    
    return (
      <Card sx={{ maxWidth: 800 }} className="container">
        <CardHeader
          avatar={
           <Link to={{pathname: "/users/"+userId}}> <Avatar src={'/avatars/avatar'+(avatar+1)+'.jpg'} sx={{ bgcolor: red[500] }} aria-label="recipe">
           {avatar}
         </Avatar></Link>
          }
          
         
          title={ 
          <TextField 
          id="outlined-basic" 
          label="Başlık" 
          variant="outlined" 
          type="text"   
          className="postform-title"
    
          inputProps={{ 
            maxLength: 41 
          }}
            value={stitle} onChange={(e) => setTitle(e.target.value) }
           ></TextField>}
          
        />
    
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} >
          <TextField 
            id="outlined-basic" 
            label="Neler Oluyor?" 
            variant="outlined" 
            type="text"   
            className="postform-text" 
            multiline
            minRows={1}
            inputProps={{ 
                maxLength: 250 
              }}
            value={stext} 
            onChange={(e) => setText(e.target.value)}
          
         />
          </Typography>
          <Button onClick={handleSubmit}
              variant="contained" 
              color="primary"
              style={{ height: '40px', marginTop: '10px' }}
            >
              Paylaş
            </Button>
        </CardContent>
        
      
      </Card>
    );
}

export default PostForm;