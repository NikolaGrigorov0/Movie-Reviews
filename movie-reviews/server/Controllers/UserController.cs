using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // ✅ Get user by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            var user = _userService.GetUserById(id);
            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }

        // ✅ Update user details (PUT request)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            bool updated = await _userService.UpdateUserAsync(id, request.Username, request.Password, request.ProfilePhoto);
            if (!updated) return BadRequest("No updates were made.");
            return Ok("User updated successfully.");
        }
    }

    // ✅ Request model for updating user
    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? ProfilePhoto { get; set; }
    }
}
