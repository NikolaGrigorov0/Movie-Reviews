using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;


namespace server.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MovieController : ControllerBase
    {
        private readonly MovieService _movieService;

        public MovieController(MovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public ActionResult<List<Movie>> Get() => _movieService.Get();


        [HttpGet("{id:length(24)}", Name = "GetMovie")]
        public ActionResult<Movie> Get(string id)
        {
            var movie = _movieService.Get(id);
            if (movie == null) return NotFound();
            return movie;
        }

        [HttpPost]
        public ActionResult<Movie> Create(Movie movie)
        {
            _movieService.Create(movie);
            return CreatedAtRoute("GetMovie", new { id = movie.Id }, movie);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Movie movieIn)
        {
            var movie = _movieService.Get(id);
            if (movie == null) return NotFound();
            _movieService.Update(id, movieIn);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var movie = _movieService.Get(id);
            if (movie == null) return NotFound();
            _movieService.Remove(id);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Movie>>> SearchMovies([FromQuery] string query)
        {
            var movies = await _movieService.SearchMoviesAsync(query);
            return Ok(movies);
        }
    }
}