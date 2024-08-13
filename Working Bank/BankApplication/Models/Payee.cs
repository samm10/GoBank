using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankApplication.Models
{
    public class Payee
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public string UserId { get; set; }
        
        public string PayeeUserId { get; set; }
        public User User { get; set; }
        public string Name {  get; set; }
        public string AccountNumber { get; set; }
        public string NickName { get; set; }
    }
}
