using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "User ID is required.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        public string LoginPassword { get; set; }
    }
}
