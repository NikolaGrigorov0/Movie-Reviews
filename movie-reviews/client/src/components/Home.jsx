import React, { useState, useEffect } from "react";
import { fetchMovies } from "../services/movieService";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Fetch movie data from the backend using fetch
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5213/api/movies"); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const movies = await response.json();
  
        // Assuming you want to split them into categories (adjust as necessary)
        setTopMovies(movies.slice(0, 3)); // Top 3 movies
        setPopularMovies(movies.slice(3, 8)); // Popular movies
        setRecentlyViewed(movies.slice(8, 14)); // Recently viewed
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-center py-32 bg-gray-800">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-4">Explore the World of Cinema</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover reviews, ratings, and insights from fellow movie lovers.
          </p>
          <button className="mt-6 px-6 py-3 bg-violet-800 hover:bg-violet-700 rounded-lg text-lg font-semibold">
            Browse Movies
          </button>
        </div>
      </section>

      {/* Top 3 Movies */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Top 3</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img
                src={movie.image || "https://via.placeholder.com/300"}
                alt={movie.title}
                className="w-full h-72 object-cover rounded-md mb-4"
              />
              <h2 className="text-2xl font-semibold">{movie.title}</h2>
              <p className="text-gray-400 mt-2">{movie.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Movies and TV Series */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Popular Movies and TV Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {popularMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={movie.image || "https://via.placeholder.com/200"}
                alt={movie.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-medium text-center">{movie.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-3 gap-6">
            {recentlyViewed.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-3 rounded-lg shadow-lg">
                <img
                  src={movie.image || "https://via.placeholder.com/150"}
                  alt={movie.title}
                  className="w-full h-36 object-cover rounded-md mb-2"
                />
                <h4 className="text-sm font-medium text-center">{movie.title}</h4>
              </div>
            ))}
          </div>
          {/* Lists Section */}
          <div className="bg-gray-900 p-5 rounded-lg flex flex-col space-y-4">
            <h2 className="text-3xl font-bold mb-6">Lists</h2>
            <div className="bg-gray-700 w-full h-20 rounded-md"></div>
            <div className="bg-gray-700 w-full h-20 rounded-md"></div>
            <div className="bg-gray-700 w-full h-20 rounded-md"></div>
            <div className="bg-gray-700 w-full h-20 rounded-md"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
