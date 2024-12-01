import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
function CommentForm({postId, userId, refreshComments}){
    const [commentText, setCommentText] = React.useState("");
    
    const handleComment = async (e) => {
        console.log("Post clicked text: " + commentText);  
        if(commentText.length > 0){
          const payload = {
            userId: userId,
            postId: postId,
            text: commentText,
          };
      
          try {
            const response = await fetch('http://localhost:8080/comments', {
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
            alert('Yorum başarıyla paylaşıldı!');
            setCommentText("");
            window.location.reload();
      
          } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
            }
        }
        else{
          alert("Yorum boş olamaz!");
        }
    };

    const handleSubmit = () => {
        handleComment();
        refreshComments();
    }

    return <div>
        <Card>
        <CardContent style={{width: '86%', marginLeft: '65px'}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }} >
            <TextField 
              id="outlined-basic" 
              label={"Yorumunu paylaş"}
              variant="outlined" 
              type="text"   
              className="postform-text" 
              multiline
              minRows={1}
              inputProps={{ 
                  maxLength: 190
              }}
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <SendIcon 
              onClick={handleSubmit}
              color="primary"
              style={{ 
                height: '30px', 
                width: '40px', 
                marginLeft: '10px',
                cursor: 'pointer' 
              }}
            />
          </Typography>
        </CardContent>
        </Card>
    </div>
}   

export default CommentForm;