import React from "react";
import Navbar from "./components/Navbar";

const movies = [
  {
    id: 1,
    title: "Inception",
    description: "A mind-bending thriller by Christopher Nolan.",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Interstellar",
    description: "A journey through space and time.",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "The Dark Knight",
    description: "Batman faces off against the Joker.",
    image: "https://via.placeholder.com/300",
  },
];

function App() {
  return (

    <div className="min-h-screen bg-gray-900 text-white font-sans">

     <Navbar/> 

      {/* Hero Section */}
      <section className="relative text-center py-32 bg-gray-800">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-4">Explore the World of Cinema</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover reviews, ratings, and insights from fellow movie lovers.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold">
            Browse Movies
          </button>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-16">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            <p className="text-gray-400 mt-2">{movie.description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Movie Reviews. All rights reserved.
      </footer>
    </div>
  );
}

export default App;