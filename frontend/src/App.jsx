import React from 'react';
import '../index.css';
import Home from './pages/Home.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './pages/pageNotFound.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const token = localStorage.getItem("jwt");
  return (
    <div>
      <Routes>
        <Route path='/' element={token?<Home/>:<Navigate to={"/login"}/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='*' element={<PageNotFound/>}/>
        
      </Routes> 
       <Toaster />

    </div>
  );
}

export default App;