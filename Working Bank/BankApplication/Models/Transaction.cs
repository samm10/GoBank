using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankApplication.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]  
        public string UserId { get; set; }
        public string PayeeUserId { get; set; }
        public User User { get; set; }
        public string TransactionType { get; set; }
        public double Amount { get; set; }
        public DateTime date{ get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
