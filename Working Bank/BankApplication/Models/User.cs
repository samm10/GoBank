using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankApplication.Models
{
    public class User
    {
        [Key]
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public long PhoneNumber { get; set; }
        public int Age {  get; set; }
        public string Gender { get; set; }
        public string AccountType { get; set; }
        public double Balance { get; set; }
        public string Status { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Payee> Payees { get; set; } = new List<Payee>();

    }
}
