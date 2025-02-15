import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { fetchUser, getUserIdFromToken } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";

const generateReviewStars = (rating) => {
  const stars = [];
  const maxStars = 10;

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          className="text-yellow-400 text-2xl"
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FontAwesomeIcon
          key={`half-${i}`}
          icon={faStarHalfAlt}
          className="text-yellow-400 text-2xl"
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStar}
          className="text-gray-700 text-2xl"
        />
      );
    }
  }
  return stars;
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [userDetails, setUserDetails] = useState({}); // Store user details for each review
  const userId = getUserIdFromToken(localStorage.getItem("token"));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5213/api/movies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();

        setMovie(data);
        setReviews(data.reviews || []);

        // Fetch user details for each review
        const userDetailsMap = {};
        for (const review of data.reviews || []) {
          const user = await fetchUser(review.userId);
          userDetailsMap[review.userId] = user;
        }
        setUserDetails(userDetailsMap);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.trim() || newRating === 0) {
      toast.error("Please add a review and select a star rating.");
      return;
    }

    const reviewData = { userid: userId, movieId: id, description: newReview, rating: newRating };

    try {
      const response = await fetch("http://localhost:5213/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const data = await response.json();
      console.log("Review submitted successfully:", data);

      // Fetch the user details for the new review
      const user = await fetchUser(userId);
      setUserDetails((prev) => ({ ...prev, [userId]: user }));

      // Add the new review to the reviews list
      setReviews((prev) => [...prev, { ...reviewData, userId }]);
      setNewReview("");
      setNewRating(0);
      window.location.reload();
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("An error occurred while submitting the review.")
    }
  };

  if (!movie) return <p className="text-center text-gray-400">Loading movie details...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 rounded-lg shadow-xl mt-8">
      <h1 className="text-4xl font-extrabold mb-6 text-white">{movie.title}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={movie.image || "https://via.placeholder.com/400"}
            alt={movie.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <p className="text-lg text-gray-300">{movie.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-white">Rating:</span>
            <div className="flex">{movie.starRating ? generateReviewStars(movie.starRating) : "No rating available"}</div>
            <span className="text-gray-300 text-lg">({movie.starRating}/10)</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4 text-white">Reviews</h2>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={userDetails[review.userId]?.profilePhoto || "https://via.placeholder.com/50"}
                    alt={`${userDetails[review.userId]?.username || "Anonymous"}'s profile`}
                    className="w-10 h-10 rounded-full border border-gray-500"
                  />
                  <span className="ml-3 text-white font-semibold">
                    {userDetails[review.userId]?.username || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  {generateReviewStars(review.rating)}
                  <span className="ml-2 text-gray-400 text-lg">({review.rating}/10)</span>
                </div>

                <p className="text-gray-300">{review.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
          )}
        </div>
      </div>

      {/* Add Review */}
      {localStorage.getItem('token') !== null && (
      <div className="bg-shadow-md border-solid border-2 border-violet-900 rounded-lg p-5 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-white">Add Your Review</h2>
        <textarea
          className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-600 transition"
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        ></textarea>
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-lg font-semibold text-white">Your Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className={`text-2xl ${
                  newRating >= star ? "text-yellow-400" : "text-gray-500"
                } hover:text-yellow-400 transition`}
              >
                <FontAwesomeIcon icon={faStar} />
              </button>
            ))}
          </div>
          <span className="text-gray-300 text-lg">({newRating}/10)</span>
        </div>

        <button
          onClick={handleAddReview}
          className="mt-4 px-6 py-3 bg-violet-900 hover:bg-violet-700 rounded-lg text-lg font-semibold transition"
        >
          Submit Review
        </button>
      </div>
    )}
      <ToastContainer 
                position="top-center"  
                autoClose={5000}        
                hideProgressBar={true}  
                closeButton={false}
            />
    </div>
  );
};

export default MovieDetails;