using MongoDB.Driver;
using server.Models;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            var database = client.GetDatabase(config["DatabaseName"]); // Ensure "DatabaseName" is set in appsettings.json
            _users = database.GetCollection<User>("Users");
        }

        public User Register(User user)
        {

            // Hash only the password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            _users.InsertOne(user);
            return user;
        }

        public User Login(string email, string password)
        {
            var user = _users.Find(u => u.Email == email).FirstOrDefault();
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }
            return user;
        }

        public User GetUserById(string id) => _users.Find(user => user.Id == id).FirstOrDefault();
    }
}
