using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankApplication.Models
{
    public class Admin
    {
        [Key]
        public string Adminid { get; set; }
        public string Email { get; set; }
        public string Password {  get; set; }
        public string Name { get; set; }
        
    }
}
