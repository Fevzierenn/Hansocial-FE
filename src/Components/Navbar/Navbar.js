import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import './Navbar.css';


function Navbar() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        setUserData(null);
        localStorage.removeItem('user');
        handleClose();
        navigate('/login');
    };

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
        setIsLoading(false);
    }, [userData, navigate]);

    if (isLoading || !userData) {
        return null;
    }

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
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Çıkış Yap
                </MenuItem>
              </Menu>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1}} >
              <Link className="text"
                  to={{
                      pathname: "/"
                  }}
              >
                  Ana Sayfa
              </Link>
              </Typography>
              <Link to={{pathname: "/users/"+userData.id}} className="text">Profilim</Link>
            </Toolbar>
          </AppBar>
        </Box>
      );


 
}

export default Navbar;