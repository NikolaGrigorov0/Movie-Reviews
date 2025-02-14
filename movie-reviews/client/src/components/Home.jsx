import React, { useState, useEffect } from "react";
import { fetchMovies } from "../services/movieService";
import { Link } from "react-router-dom";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const generateReviewStars = (rating) => {
    const stars = [];
  
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">&#9733;</span>);
    }
  
    if (rating % 1 >= 0.5) {
      stars.push(<span key="half" className="text-yellow-400">&#9733;</span>);
    }
  
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-400">&#9734;</span>);
    }
  
    return stars;
  };
  

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5213/api/movies"); // Backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const movies = await response.json();
  
        setTopMovies(movies.slice(0, 3));
        setPopularMovies(movies.slice(3, 8));
        setRecentlyViewed(movies.slice(8, 14));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-center py-32 bg-gray-800 bg-[url('/images/thematrix.jpg')] bg-cover bg-center h-[780px] pt-75">
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold text-gray-500 mb-4">Explore the World of Cinema</h1>
          <p className="text-lg font-extrabold text-gray-500 max-w-2xl mx-auto">
            Discover reviews, ratings, and insights from fellow movie lovers.
          </p>
          <button className="mt-6 px-6 py-3 bg-violet-800 hover:bg-violet-700 rounded-lg text-lg font-semibold">
            Browse Movies
          </button>
        </div>
      </section>

      {/* Trending Movies */}
      
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Trending</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-center justify-center">
              <div className="w-full md:w-[50%] flex-shrink-0">
                <img
                  src={movie.image || "https://via.placeholder.com/300"}
                  alt={movie.title}
                  className="w-full h-auto object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col md:items-start md:ml-6 mt-6 md:mt-0 w-full md:w-[50%]">
                <h2 className="text-3xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-lg text-gray-400">{movie.description}</p>
                <div className="mt-2 flex space-x-1">
                  {generateReviewStars(movie.rating)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Movies and TV Series */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Popular Movies and TV Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-9">
          {popularMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-3 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-full md:w-2/3 flex-shrink-0">
                <img
                  src={movie.image || "https://via.placeholder.com/200"}
                  alt={movie.title}
                  className="w-full h-auto object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col items-center mt-4 w-full md:w-2/3">
                <h3 className="text-lg font-medium font-bold text-center">{movie.title}</h3>
                <div className="mt-2 flex space-x-1">
                  {generateReviewStars(movie.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyViewed.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-full md:w-2/3 flex-shrink-0">
                  <img
                    src={movie.image || "https://via.placeholder.com/150"}
                    alt={movie.title}
                    className="w-full h-auto object-cover object-center rounded-md"
                  />
                </div>
                <div className="flex flex-col items-center mt-4 w-full md:w-2/3">
                  <h4 className="text-sm font-medium font-bold text-center">{movie.title}</h4>
                  <div className="mt-2 flex space-x-1">
                    {generateReviewStars(movie.rating)}
                  </div>
                </div>
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
