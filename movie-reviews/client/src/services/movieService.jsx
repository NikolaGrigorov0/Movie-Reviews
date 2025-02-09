export const fetchMovies = async () => {
    try {
      const response = await fetch("https://localhost:5213/api/movies"); // Replace with your backend URL
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