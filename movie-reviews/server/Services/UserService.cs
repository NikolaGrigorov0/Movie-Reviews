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

        public async Task<bool> UpdateUserAsync(string id, string? newUsername, string? oldPassword, string? newPassword, string? newProfilePhoto)
        {
            var user = GetUserById(id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            if (!string.IsNullOrEmpty(newUsername))
            {
                user.Username = newUsername;
            }

            if (!string.IsNullOrEmpty(newProfilePhoto))
            {
                user.ProfilePhoto = newProfilePhoto;
            }

            if (!string.IsNullOrEmpty(oldPassword) && !string.IsNullOrEmpty(newPassword))
            {
                if (!BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash))
                {
                    throw new ArgumentException("Old password is incorrect");
                }
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            }
            else if (!string.IsNullOrEmpty(oldPassword) || !string.IsNullOrEmpty(newPassword))
            {
                throw new ArgumentException("Both old and new passwords must be provided to update the password.");
            }

            var update = Builders<User>.Update
                .Set(u => u.Username, user.Username)
                .Set(u => u.ProfilePhoto, user.ProfilePhoto)
                .Set(u => u.PasswordHash, user.PasswordHash);

            var result = await _users.UpdateOneAsync(u => u.Id == id, update);

            return result.ModifiedCount > 0;
        }


    }
}
