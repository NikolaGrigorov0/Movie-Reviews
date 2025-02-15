import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import MovieDetails from "./components/MovieDetails";
import Top20 from "./components/Top20";


function App() {
  return (

    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
     <Navbar/> 
     <Routes>
     <Route path='/' element={<Home />} />
     <Route path='/login' element={<Login/>}/>
     <Route path='/signUp' element={<SignUp/>}/>
     <Route path='/profile' element={<Profile/>}/>
     <Route path='/editprofile' element={<EditProfile/>}/>
     <Route path='/movie/:id' element={<MovieDetails/>}/>
     <Route path='/top20' element={<Top20/>}/>
     </Routes>
      
      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Movie Reviews. All rights reserved.
      </footer>
    </div>
  );
}

export default App;