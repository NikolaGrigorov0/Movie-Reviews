using MongoDB.Driver;
using server.Models;


namespace server.Services
{
    public class ReviewService
    {
        private readonly IMongoCollection<Review> _reviews;

        public ReviewService(IMongoDatabase database)
        {
            _reviews = database.GetCollection<Review>("Reviews");
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

        public async Task CreateReviewAsync(Review review)
        {
            await _reviews.InsertOneAsync(review);
        }

        public async Task<bool> DeleteReviewAsync(string id)
        {
            var result = await _reviews.DeleteOneAsync(r => r.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
