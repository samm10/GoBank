using BankApplication.DTO;
using BankApplication.Models;
using BankApplication.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace BankApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IUserRepository _userRepository;
       

        public AdminController(IAdminRepository adminRepository, IUserRepository userRepository)
        {
            _adminRepository = adminRepository;
            _userRepository = userRepository;
            
        }
        
        [HttpPost("Register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddAdmin([FromBody] AdminRegisterDTO adminRegister)
        {
            var admin = new Admin
            {
                Adminid = _adminRepository.GenerateUniqueAdminId(adminRegister.Name),
                Name = adminRegister.Name,
                Password = adminRegister.Password,
                Email = adminRegister.Email,
            };
            
            var adminCred = new UserCredentials
            {
                UserId = admin.Adminid,
                Email = adminRegister.Email,
                LoginPassword = adminRegister.Password,
                LoginTime = DateTime.Now,
                Role = "Admin"
            };
            
            if (await _adminRepository.AddAdminAsync(admin, adminCred))
            {
                return Ok(admin);
            }
            return BadRequest("Admin already exists");
        }
        

        [HttpGet("ViewAdmin/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ViewAdmin(string userId)
        {
            var user = await _adminRepository.GetAdminByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Admin not found");
            }
            return Ok(user);
        }

        [HttpPut("Approve/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveUser(string userId)
        {
            bool user = await _adminRepository.ApproveUser(userId);
            if (user == false)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(new { message = $"{userId} has been approved" });
        }


        [HttpPut("UpdateAdmin/{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAdmin(string adminId, [FromBody] AdminUpdateDTO adminUpdate)
        {
            // Validate input
            if (string.IsNullOrEmpty(adminId) || adminUpdate == null)
            {
                return BadRequest("Invalid data.");
            }

            // Retrieve the admin to update
            var admin = await _adminRepository.GetAdminByIdAsync(adminId);
            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            // Update admin details
            admin.Name = adminUpdate.Name ?? admin.Name;
            admin.Email = adminUpdate.Email ?? admin.Email;
            
            if (!string.IsNullOrEmpty(adminUpdate.Password))
            {
                admin.Password = adminUpdate.Password;
            }

            // Save changes
            var updateResult = await _adminRepository.UpdateAdminAsync(admin);
            if (updateResult)
            {
                return Ok(admin);
            }
            else
            {
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpGet("GetAllAdmins")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _adminRepository.GetAllAdminsAsync();
            return Ok(admins);
        }
    }
}
