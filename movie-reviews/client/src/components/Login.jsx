import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

     try {
          const response = await loginUser(email, password);
      
          if (response.ok) {
            console.log("User logged in successfully!");
            navigate("/");
            window.location.reload(); 
          } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData);
            alert(errorData.message || "Login failed. Please try again.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred. Please try again later.");
        }

  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Login Form Section */}
      <div className="max-w-md mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 p-2 bg-violet-800 text-white rounded-lg hover:bg-violet-700 focus:outline-none"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center text-gray-400">
          <p>Don't have an account? <a href="/signup" className="text-violet-400 hover:underline hover:text-violet-500">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
