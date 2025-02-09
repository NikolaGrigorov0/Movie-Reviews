using MongoDB.Driver;
using server.Models;
using System.Threading.Tasks;

namespace server.Services
{
    public class ReviewService
    {
        private readonly IMongoCollection<Review> _reviews;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Movie> _movies;

        public ReviewService(IMongoDatabase database)
        {
            _reviews = database.GetCollection<Review>("Reviews");
            _users = database.GetCollection<User>("Users"); 
            _movies = database.GetCollection<Movie>("Movies"); 
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            return await _reviews.Find(_ => true).ToListAsync();
        }

        public async Task<List<Review>> GetReviewsByMovieIdAsync(string movieId)
        {
            return await _reviews.Find(r => r.MovieId == movieId).ToListAsync();
        }

        public async Task<Review?> GetReviewByIdAsync(string id)
        {
            return await _reviews.Find(r => r.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> CreateReviewAsync(Review review)
        {
            // Validate UserId
            var userExists = await _users.Find(u => u.Id == review.UserId).AnyAsync();
            if (!userExists)
            {
                throw new ArgumentException("User does not exist.");
            }

            // Validate MovieId
            var movieExists = await _movies.Find(m => m.Id == review.MovieId).AnyAsync();
            if (!movieExists)
            {
                throw new ArgumentException("Movie does not exist.");
            }

            // If both UserId and MovieId are valid, insert the review
            await _reviews.InsertOneAsync(review);
            return true;
        }

        public async Task<bool> DeleteReviewAsync(string id)
        {
            var result = await _reviews.DeleteOneAsync(r => r.Id == id);
            return result.DeletedCount > 0;
        }
    }
}