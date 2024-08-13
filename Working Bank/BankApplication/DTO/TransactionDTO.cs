using System;
using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class TransactionDTO
    {
        [Required(ErrorMessage = "User ID is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Payee User ID is required")]
        public string PayeeUserId { get; set; }

        [Required(ErrorMessage = "Transaction Type is required")]
        public string TransactionType { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
        public double Amount { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        public string Description { get; set; }
    }
}
