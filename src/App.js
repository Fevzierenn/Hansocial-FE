import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from './Components/Home/Home.js';
import Navbar from './Components/Navbar/Navbar.js';
import User from './Components/User/User.js';
import Login from './Components/Login/Login.js';
import Register from './Components/Register/Register.js'; 
import { UserProvider, useUser } from './context/UserContextU.js';
import Avatar from './Components/Avatar/Avatar.js';

function NavbarWrapper() {
  const location = useLocation();
  return location.pathname !== '/login' && location.pathname !== '/register' ? <Navbar /> : null;
}

function AnotherComponent() {
    const { user } = useUser();
    
    return (
        <Avatar src={`/avatars/avatar${user.avatar + 1}.jpg`} />
    );
}

function App() {
  return (

      <div className="App">
        <UserProvider>    
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<><NavbarWrapper /><Home /></>} />
            <Route path="/users/:userId" element={<><NavbarWrapper /><User /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>  
    </div>
  );
}

export default App;
