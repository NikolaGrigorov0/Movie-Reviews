using MongoDB.Driver;
using server.Models;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Diagnostics;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            var database = client.GetDatabase(config["DatabaseName"]); 
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
        public User GetUserByEmail(string email) => _users.Find(user => user.Email == email).FirstOrDefault();

        public async Task<bool> UpdateUserAsync(string id, string? newUsername, string? OldPassword, string? newPassword, string? newProfilePhoto)
        {
            var update = Builders<User>.Update;
            var updates = new List<UpdateDefinition<User>>();
            var user = GetUserById(id);

            if(!BCrypt.Net.BCrypt.Verify(OldPassword, user.PasswordHash)){
                return false;
            }
            if (!string.IsNullOrEmpty(newUsername))
            {
                updates.Add(update.Set(u => u.Username, newUsername));
            }

            if (!string.IsNullOrEmpty(newPassword))
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
                updates.Add(update.Set(u => u.PasswordHash, hashedPassword));
            }

            if (!string.IsNullOrEmpty(newProfilePhoto))
            {
                updates.Add(update.Set(u => u.ProfilePhoto, newProfilePhoto));
            }

            if (updates.Count == 0) return false; 

            var result = await _users.UpdateOneAsync(
                u => u.Id == id,
                update.Combine(updates)
            );

            return result.ModifiedCount > 0;
        }
    }
}
