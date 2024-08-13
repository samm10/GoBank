using System;
using System.ComponentModel.DataAnnotations;

namespace BankApplication.DTO
{
    public class TransactionUpdateDTO
    {
        [Required(ErrorMessage = "Transaction ID is required.")]
        public int TransactionID { get; set; }

        [Required(ErrorMessage = "Transaction type is required.")]
        public string TransactionType { get; set; }

        [Required(ErrorMessage = "Transaction date is required.")]
        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }
    }
}
