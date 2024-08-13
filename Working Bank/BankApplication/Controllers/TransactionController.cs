using BankApplication.DTO;
using BankApplication.Models;
using BankApplication.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BankApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }


        [HttpGet("AllTransactions")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _transactionRepository.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        [HttpGet("TransactionsByUserId/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> TransactionsByUserId(string userId)
        {
            var transactions = await _transactionRepository.GetTransactionsByUserIdAsync(userId);
            return Ok(transactions);
        }

        [HttpGet("TransactionById/{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> TransactionById(int id)
        {
            var transaction = await _transactionRepository.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }
            return Ok(transaction);
        }


        [HttpGet("CheckUserAccountExists/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> CheckUserAccountExists(string userId)
        {
            var exists = await _transactionRepository.CheckUserAccountExistsAsync(userId);
            return Ok(exists);
        }

        [HttpGet("CheckPayeeAccountExists/{payeeUserId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> CheckPayeeAccountExists(string payeeUserId)
        {
            var exists = await _transactionRepository.CheckPayeeAccountExistsAsync(payeeUserId);
            return Ok(exists);
        }

        [HttpGet("CheckSufficientBalance/{userId}/{amount}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> CheckSufficientBalance(string userId, double amount)
        {
            var sufficient = await _transactionRepository.CheckSufficientBalanceAsync(userId, amount);
            return Ok(sufficient);
        }


        [HttpPost("AddTransaction")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> AddTransaction([FromBody] TransactionDTO transactionDTO)
        {
            if (transactionDTO == null)
            {
                return BadRequest("Transaction data is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transaction = new Transaction
            {
                UserId = transactionDTO.UserId,
                PayeeUserId = transactionDTO.PayeeUserId,
                TransactionType = transactionDTO.TransactionType,
                Amount = transactionDTO.Amount,
                date = transactionDTO.Date,
                Description = transactionDTO.Description,
                Status = "Pending"
            };

            var resultMessage = await _transactionRepository.AddTransactionAsync(transaction);

            if (resultMessage == "Transaction Successful")
            {
                return Ok(transaction);
            }
            else
            {
                return BadRequest(resultMessage);
            }
        }


        [HttpPut("UpdateTransaction")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTransaction([FromBody] TransactionUpdateDTO transactionDTO)
        {
            if (await _transactionRepository.UpdateTransactionAsync(transactionDTO))
            {
                return Ok();
            }
            return NotFound("Transaction not found");
        }

        [HttpDelete("DeleteTransaction/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTransaction(int userId)
        {
            if (await _transactionRepository.DeleteTransactionAsync(userId))
            {
                return Ok();
            }
            return NotFound("Transaction not found");
        }
    }
}
