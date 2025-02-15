import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function TopTenMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const response = await fetch("http://localhost:5213/api/movies");
        if (response.ok) {
          let data = await response.json();
          data = data.sort((a, b) => b.starRating - a.starRating).slice(0, 20);
          setMovies(data);
        } else {
          console.error("Failed to fetch top movies");
        }
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    }
    fetchTopMovies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-white">
      <h1 className="text-4xl font-extrabold text-violet-700 mb-8 text-center">Top 20 Movies</h1>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-violet-600"
            >
              <div className="w-full flex-shrink-0">
                <img
                  src={movie.image || "https://via.placeholder.com/200"}
                  alt={movie.title}
                  className="w-full h-auto object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col items-center mt-4 w-full">
                <h2 className="text-lg font-semibold text-center">
                  {index + 1}. {movie.title}
                </h2>
                <div className="mt-2 flex space-x-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-2xl" />
                  <p className="text-gray-300">{movie.starRating ? movie.starRating : "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No movies available</p>
      )}
    </div>
  );
}
