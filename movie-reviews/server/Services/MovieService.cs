using MongoDB.Driver;
using server.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<List<Movie>> SearchMoviesAsync(string query)
        {
            var filter = Builders<Movie>.Filter.Regex("title", new MongoDB.Bson.BsonRegularExpression(query, "i"));
            return await _movies.Find(filter).Limit(5).ToListAsync();
        }

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
