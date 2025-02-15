using MongoDB.Driver;
using server.Models;
using Microsoft.Extensions.Options;

namespace server.Services
{
    public class MovieService
    {
        private readonly IMongoCollection<Movie> _movies;

        public MovieService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            var database = client.GetDatabase(config["DatabaseName"]);
            _movies = database.GetCollection<Movie>("Movies");
        }

        public List<Movie> Get() => _movies.Find(movie => true).ToList();

        public Movie Get(string id) => _movies.Find(movie => movie.Id == id).FirstOrDefault();

        public Movie Create(Movie movie)
        {
            _movies.InsertOne(movie);
            return movie;
        }

        public void Update(string id, Movie movieIn) =>
        
            _movies.ReplaceOne(movie => movie.Id == id, movieIn);

        public void Remove(string id) => _movies.DeleteOne(movie => movie.Id == id);
    }
}