using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankApplication.Models
{
    public class UserCredentials
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string LoginPassword { get; set; }
        public DateTime LoginTime { get; set; }
        public string Role { get; set; }
    }
}
