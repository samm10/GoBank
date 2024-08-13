using BankApplication.DTO;
using BankApplication.Models;
using BankApplication.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BankApplication.Services;
using static BankApplication.DTO.ForgotCredentialsDTO;

namespace BankApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserCredentialsRepository _userCredentialsRepository;
        private readonly IConfiguration _configuration;
       

        public UserController(IUserRepository userRepository, IUserCredentialsRepository userCredentialsRepository, IConfiguration configuration, EmailService emailService)
        {
            _userRepository = userRepository;
            _userCredentialsRepository = userCredentialsRepository;
            _configuration = configuration;
        }

        [HttpGet("AllUsers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AllUsers()
        {
            var users = await _userRepository.GetAllUser();
            return Ok(users);
        }

        // UserController.cs
        [HttpGet("SearchUsersById/{searchTerm}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SearchUsersById(string searchTerm)
        {
            var users = await _userRepository.SearchUsersByUserIdAsync(searchTerm);
            return Ok(users);
        }


        [HttpGet("UserById/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UserById(string userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user != null)
            {
                return Ok(user);
            }
            return NotFound("User not found");
        }

        [HttpGet("UserWithTransactions/{UserId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetUserWithTransactions(string UserId)
        {
            var user = await _userRepository.GetUserWithTransactionsAsync(UserId);
            if (user != null)
            {
                return Ok(user);
            }
            return NotFound("User not found");
        }
        
        
        [HttpGet("UserWithPayees/{UserId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetUserWithPayees(string UserId)
        {
            var user = await _userRepository.GetUserWithPayeesAsync(UserId);
            var list = user.Payees;
            List<string> PayeeIdList = new List<string>();
            foreach (var item in list) { 
                var Id = item.PayeeUserId;
                PayeeIdList.Add(Id);
            }
            

            if (user != null)
            {
                return Ok(PayeeIdList);
            }
            return NotFound("User not found");
        }

        [HttpGet("IsUserApproved/{userId}")]
        public async Task<IActionResult> IsUserApproved(string userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            bool isApproved = user.Status == "Approved";
            return Ok(new { IsApproved = isApproved });
        }


        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] UserDTO userCreateRequest)
        {
            var user = new User
            {
                UserId = _userRepository.GenerateUniqueUserId(userCreateRequest.Name),
                Name = userCreateRequest.Name,
                Email = userCreateRequest.Email,
                PhoneNumber = userCreateRequest.PhoneNumber,
                Age = userCreateRequest.Age,
                Gender = userCreateRequest.Gender,
                Status = "Approval_Pending",
                AccountType = userCreateRequest.AccountType
            };

            var usercred = new UserCredentials
            {
                UserId = user.UserId,
                Email = userCreateRequest.Email,
                LoginPassword = userCreateRequest.Password,
                LoginTime = DateTime.Now,
                Role = "User"
            };

            if (await _userRepository.AddUserAsync(user, usercred))
            {
                return Ok(user);
            }
            return BadRequest("User already exists");
        }

        [HttpPut("UpdateUser")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdateUser(User user)
        {
            if (await _userRepository.UpdateUserAsync(user))
            {
                return Ok();
            }
            return NotFound("User not found");
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveUser(string userId)
        {
            if (await _userRepository.RemoveUserAsync(userId))
            {
                return Ok("User deleted successfully");
            }
            return NotFound("User not found");
        }


        [HttpPut("ResetLoginPassword")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> ResetLoginPassword([FromBody] ResetLoginPasswordDTO resetPasswordRequest)
        {
            if (await _userCredentialsRepository.ResetLoginPasswordAsync(resetPasswordRequest.UserId, resetPasswordRequest.OldPassword, resetPasswordRequest.NewPassword))
            {
                return Ok("Login password reset successfully");
            }
            return BadRequest("Failed to reset login password");
        }

    }
}
