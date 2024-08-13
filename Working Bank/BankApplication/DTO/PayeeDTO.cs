using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class PayeeDTO
    {
        [Required(ErrorMessage = "User ID is required.")]
        [MinLength(1, ErrorMessage = "User ID cannot be empty.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Payee ID is required.")]
        [MinLength(1, ErrorMessage = "Payee ID cannot be empty.")]
        public string PayeeId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; }

        [MaxLength(50, ErrorMessage = "Nickname cannot exceed 50 characters.")]
        public string NickName { get; set; }
    }
}
