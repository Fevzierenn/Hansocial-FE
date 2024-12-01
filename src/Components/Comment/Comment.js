import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function Comment({id, text, userName, userId}){
   

    
    return <div>
        <Box>
            
        <TextField style={{width: '80%', marginTop: '10px', marginBottom: '10px'}}
          id="outlined-read-only-input"
          label={userName}
          defaultValue={text}
          multiline
          minRows={1}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        </Box>
    </div>;
}

export default Comment;