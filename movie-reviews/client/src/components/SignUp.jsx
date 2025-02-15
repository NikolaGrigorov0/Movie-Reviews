import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "Username is required.";
    } else if (username.length < 3 || username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await registerUser(username, email, password);
  
      if (response.ok) {
        toast.success("User registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Server Error Response:", errorData);
  
        const errors = { ...validationErrors };
  
        if (errorData.message) {
          if (errorData.message.toLowerCase().includes("email already exists")) {
            errors.email = "Email is already in use.";
          }
          if (errorData.message.toLowerCase().includes("username already taken") ||
              errorData.message.toLowerCase().includes("username or email already exists")) {
            errors.username = "Username is already taken.";
          }
        }
  
        setValidationErrors(errors);
        toast.error(errorData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-md mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {validationErrors.username && <p className="text-red-500">{validationErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validationErrors.password && <p className="text-red-500">{validationErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {validationErrors.confirmPassword && <p className="text-red-500">{validationErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-violet-800 text-white rounded-lg hover:bg-violet-700"
          >
            Sign Up
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default SignUp;
