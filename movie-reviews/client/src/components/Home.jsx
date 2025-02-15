import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5213/api/movies");
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

  const scrollToTrending = () => {
    document.getElementById("trending").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-black bg-[url('/images/Godfather.webp')] bg-cover bg-center h-[780px] pt-75 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
        <div className="relative z-10 flex flex-col items-center md:items-start justify-center h-auto max-w-full px-6 md:px-16 text-center md:text-left">
          <h1 className="text-3xl md:text-6xl font-extrabold text-gray-300 mb-4">
            Explore the World of Cinema
          </h1>
          <p className="text-base md:text-lg font-extrabold text-gray-300 max-w-2xl">
            Discover reviews, ratings, and insights from fellow movie lovers.
          </p>
          <button
            onClick={scrollToTrending}
            className="mt-6 bg-violet-900 hover:bg-violet-700 text-white px-6 py-3 rounded-lg text-lg font-bold transition duration-300 flex items-center space-x-2"
          >
            <span>Browse Movies</span>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </button>
        </div>
      </section>

      {/* Trending Movies */}
      <section id="trending" className="px-6 py-16 text-white">
        <h2 className="text-3xl font-bold mb-6 text-violet-700">Trending</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topMovies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-violet-600"
            >
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
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400 text-2xl"
                  />
                  <p>{movie.starRating ? movie.starRating : "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="px-6 py-16 text-white">
        <h2 className="text-3xl font-bold mb-6 text-violet-700">Popular Movies and TV Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-9">
          {popularMovies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 p-3 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-violet-600"
            >
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
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400 text-2xl"
                  />
                  <p>{movie.starRating ? movie.starRating : "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="px-6 py-16 text-white">
        <h2 className="text-xl font-bold mb-6 text-violet-700">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {recentlyViewed.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-violet-600"
            >
              <div className="w-full flex-shrink-0">
                <img
                  src={movie.image || "https://via.placeholder.com/150"}
                  alt={movie.title}
                  className="w-full h-auto object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col items-center mt-4 w-full">
                <h4 className="text-sm font-medium font-bold text-center">{movie.title}</h4>
                <div className="mt-2 flex items-center space-x-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-2xl" />
                  <p>{movie.starRating ? movie.starRating : "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
