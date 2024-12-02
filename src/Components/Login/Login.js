import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper 
} from "@mui/material";
import { useNavigate } from "react-router-dom";


function Login() {
    
    const [userLogin, setUserLogin] = useState({
        id: "",
        username: "",
        email: "",
        avatar: "",
    });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const loginUser = async (e) => {
    const payload = formData;
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      
      if (response.ok) {
        alert('Giriş Başarılı! Ana sayfaya yönlendiriliyorsunuz...');
        const user ={
            id: data.id,
            username: data.username,
            email: data.email,
            avatar: data.avatar
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, userData: data };
      }
       else {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }
    } catch (error) {
      alert('Giriş işlemi başarısız oldu! Kayıt sayfasına yönlendiriliyorsunuz...');
      console.error('error posting login:', error);
      return false;
    }
  
  
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser();
    if (result.success) {
      navigate("/");
    } else {
      navigate("/register");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center">
            Giriş Yap
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/register")}
            >
              Hesabın yok mu? Kayıt ol
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;