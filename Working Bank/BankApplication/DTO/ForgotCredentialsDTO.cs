using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class ForgotCredentialsDTO
    {
        public class ResetLoginPasswordDTO
        {
            [Required(ErrorMessage = "User ID is required.")]
            public string UserId { get; set; }

            [Required(ErrorMessage = "Old password is required.")]
            public string OldPassword { get; set; }

            [Required(ErrorMessage = "New password is required.")]
            [MinLength(8, ErrorMessage = "New password must be at least 8 characters long.")]
            [RegularExpression(@"^(?=.*[A-Z])(?=.*[\W_]).+$", ErrorMessage = "New password must contain at least one uppercase letter and one special character.")]
            public string NewPassword { get; set; }
        }

        public class ResetTransactionPasswordDTO
        {
            [Required(ErrorMessage = "User ID is required.")]
            public string UserId { get; set; }

            [Required(ErrorMessage = "New transaction password is required.")]
            [MinLength(8, ErrorMessage = "New transaction password must be at least 8 characters long.")]
            [RegularExpression(@"^(?=.*[A-Z])(?=.*[\W_]).+$", ErrorMessage = "New transaction password must contain at least one uppercase letter and one special character.")]
            public string NewTransactionPassword { get; set; }
        }

        public class ResetUserNameDTO
        {
            [Required(ErrorMessage = "User ID is required.")]
            public string UserId { get; set; }

            [Required(ErrorMessage = "New user name is required.")]
            [StringLength(100, ErrorMessage = "New user name must be less than 100 characters.")]
            public string NewUserName { get; set; }
        }
    }
}
