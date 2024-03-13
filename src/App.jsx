import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomAppBar from './components/Header/Header.jsx';
import WelcomePage from './pages/Welcome/WelcomePage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx'; 
import CreateAccountPage from './pages/Create Account/CreateAccountPage.jsx';

function App() {
  return (
    <Router>
      <div>
        <CustomAppBar showIconButton={false} showThemeButton={true} />
        
        {/* Route tanımlamaları */}
        <Routes>
          <Route path="/" element={<WelcomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path='/createAccount' element={<CreateAccountPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
