import { useEffect, useState } from 'react';

export default function TopTenMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const response = await fetch('http://localhost:5213/api/movies');
        if (response.ok) {
          let data = await response.json();
          data = data.sort((a, b) => b.starRating - a.starRating).slice(0, 20);
          setMovies(data);
        } else {
          console.error('Failed to fetch top movies');
        }
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    }
    fetchTopMovies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Top 20 Movies</h1>
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie, index) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col items-center">
              <img src={movie.image} alt={movie.title} className="w-3/4 h-auto aspect-[2/3] object-cover object-center rounded-md" />
              <h2 className="text-lg font-semibold text-white mt-3 text-center">{index + 1}. {movie.title}</h2>
              <p className="text-gray-400 text-sm">Rating: {movie.starRating}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No movies available</p>
      )}
    </div>
  );
}
