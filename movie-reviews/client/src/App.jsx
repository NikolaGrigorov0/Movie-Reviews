import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";


function App() {
  return (

    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
     <Navbar/> 
     <Routes>
     <Route path='/' element={<Home />} />
     <Route path='/login' element={<Login/>}/>
     <Route path='/signUp' element={<SignUp/>}/>
     </Routes>
      
      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Movie Reviews. All rights reserved.
      </footer>
    </div>
  );
}

export default App;