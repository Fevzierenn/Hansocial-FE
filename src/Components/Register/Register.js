import React, { useState } from "react";
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    avatar: "1"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const checkPassword = () => {
    return formData.password === formData.confirmPassword;
}



const saveUser = async (e) => {
  const payload = {
    email: formData.email,
    userName: formData.userName,
    password: formData.password,
    avatar: formData.avatar 
  };
  try {
    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response from server data:', data);
    console.log('Response from server res:', response);
    
    if (response.ok || response.status === 201) {
      alert('Kayıt başarıyla gerçekleşti!');
      return true;
    } else if (response.status === 409) {
      alert("Bu kullanıcı adı ya da email zaten kullanılıyor!");
      return false;
    } else {
      throw new Error(`Sunucu hatası: ${response.status}`);
    }
  } catch (error) {
    alert('Kayıt işlemi başarısız oldu');
    console.error('Error posting User:', error);
    return false;
  }


};





  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!checkPassword()){
        alert("Şifreler eşleşmiyor!");
        return;
    }
    
    const success = await saveUser();
    if (success) {
      console.log(formData);
      navigate('/login');
    }
  };  


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Kayıt Ol
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Şifre Tekrar"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <Button 
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Kayıt Ol
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;