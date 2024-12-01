import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from './Components/Home/Home.js';
import Navbar from './Components/Navbar/Navbar.js';
import User from './Components/User/User.js';
import Login from './Components/Login/Login.js';
import Register from './Components/Register/Register.js';
function NavbarWrapper() {
  const location = useLocation();
  return location.pathname !== '/login' && location.pathname !== '/register' ? <Navbar /> : null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route  path="/" element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
