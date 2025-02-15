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
           
            var userExists = await _users.Find(u => u.Id == review.UserId).AnyAsync();
            if (!userExists)
            {
                throw new ArgumentException("User does not exist.");
            }

            
            var movie = await _movies.Find(m => m.Id == review.MovieId).FirstOrDefaultAsync();
            if (movie == null)
            {
                throw new ArgumentException("Movie does not exist.");
            }

           
            await _reviews.InsertOneAsync(review);

            
            var filter = Builders<Movie>.Filter.Eq(m => m.Id, review.MovieId);
            var update = Builders<Movie>.Update.Push(m => m.Reviews, review);
            await _movies.UpdateOneAsync(filter, update);

            
            await UpdateMovieRating(review.MovieId);

            return true;
        }

        public async Task<bool> DeleteReviewAsync(string id)
        {
            var review = await _reviews.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (review == null)
            {
                return false;
            }

            
            var result = await _reviews.DeleteOneAsync(r => r.Id == id);

            
            var filter = Builders<Movie>.Filter.Eq(m => m.Id, review.MovieId);
            var update = Builders<Movie>.Update.PullFilter(m => m.Reviews, r => r.Id == id);
            await _movies.UpdateOneAsync(filter, update);

            
            await UpdateMovieRating(review.MovieId);

            return result.DeletedCount > 0;
        }

        private async Task UpdateMovieRating(string movieId)
        {
            var reviews = await _reviews.Find(r => r.MovieId == movieId).ToListAsync();
            double newAverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0.0;

            var filter = Builders<Movie>.Filter.Eq(m => m.Id, movieId);
            var update = Builders<Movie>.Update.Set(m => m.StarRating, newAverageRating);
            await _movies.UpdateOneAsync(filter, update);
        }
    }
}
