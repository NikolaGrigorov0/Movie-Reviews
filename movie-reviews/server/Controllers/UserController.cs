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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            var user = _userService.GetUserById(id);
            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }

       [HttpPut("{id}")]
public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
{
    if (request == null)
    {
        return BadRequest("Invalid request body.");
    }

    bool updated = await _userService.UpdateUserAsync(
        id,
        request.Username,  
        request.OldPassword, 
        request.NewPassword,  
        request.ProfilePhoto  
    );

    if (!updated)
    {
        return BadRequest("No updates were made.");
    }
    return Ok("User updated successfully.");
}
    }

    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? OldPassword {get; set;}
        public string? NewPassword { get; set; }
        public string? ProfilePhoto { get; set; }
    }
}
