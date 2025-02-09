using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // Get all reviews
        [HttpGet]
        public async Task<ActionResult<List<Review>>> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }

        // Get reviews by MovieId
        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<List<Review>>> GetReviewsByMovieId(string movieId)
        {
            var reviews = await _reviewService.GetReviewsByMovieIdAsync(movieId);
            return Ok(reviews);
        }

        // Get a single review by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReviewById(string id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null) return NotFound("Review not found.");
            return Ok(review);
        }

        // Create a new review
        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview([FromBody] Review review)
        {
            await _reviewService.CreateReviewAsync(review);
            return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
        }

        // Delete a review by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var deleted = await _reviewService.DeleteReviewAsync(id);
            if (!deleted) return NotFound("Review not found.");
            return NoContent();
        }
    }
}
