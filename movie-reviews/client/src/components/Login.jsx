import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
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
      const response = await loginUser(email, password);

      if (response.ok) {
        toast.success("Login successful!");
        navigate("/");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Invalid username or password.");
        setValidationErrors({ login: "Invalid username or password." });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-md mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

          {validationErrors.login && <p className="text-red-500">{validationErrors.login}</p>}

          <button
            type="submit"
            className="w-full p-2 bg-violet-800 text-white rounded-lg hover:bg-violet-700"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          <p>Don't have an account? <a href="/signup" className="text-violet-400 hover:underline hover:text-violet-500">Sign Up</a></p>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Login;
