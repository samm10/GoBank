using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class AddBalanceDTO
    {
        [Required(ErrorMessage = "UserId is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
        public double Amount { get; set; }
    }
}
