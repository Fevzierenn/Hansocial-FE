import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';
import { useLocation } from 'react-router-dom';
function Navbar() {
    const userId = 1;
    const location = useLocation();
    const { userLogin } = location.state || {}; // state içinden userId'yi al
    return (
        <Box sx={{ flexGrow: 1 }} className="navbar">
          <AppBar position="static">
            <Toolbar >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
              <Link 
                  to={{
                      pathname: "/",
                      state: { userLogin: userLogin }
                  }}
              >
                  Home
              </Link>
              </Typography>
              <Link to={{pathname: "/users/"+userLogin.id}} className="text">User</Link>
            </Toolbar>
          </AppBar>
        </Box>
      );


 
}

export default Navbar;