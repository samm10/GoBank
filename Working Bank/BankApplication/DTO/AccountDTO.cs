using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class AccountDTO
    {
        [Required(ErrorMessage = "UserId is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "IFSC is required")]
        [RegularExpression(@"^[A-Z]{4}\d{9}$", ErrorMessage = "Invalid IFSC format")]
        public string IFSC { get; set; }

        [Required(ErrorMessage = "BranchName is required")]
        public string BranchName { get; set; }

        [Required(ErrorMessage = "AccountType is required")]
        public string AccountType { get; set; }

        [Required(ErrorMessage = "AddressLine is required")]
        public string AddressLine { get; set; }

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "State is required")]
        public string State { get; set; }

        [Required(ErrorMessage = "PostalCode is required")]
        [RegularExpression(@"^\d{5,6}$", ErrorMessage = "Invalid PostalCode format")]
        public string PostalCode { get; set; }
    }
}
