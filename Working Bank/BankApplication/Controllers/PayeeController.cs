using BankApplication.DTO;
using BankApplication.Models;
using BankApplication.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayeeController : ControllerBase
    {
        private readonly IPayeeRepository _payeeRepository;
        private readonly BankDBContext _context;
        private readonly ILogger<PayeeController> _logger;

        public PayeeController(IPayeeRepository payeeRepository, BankDBContext context, ILogger<PayeeController> logger)
        {
            _context = context;
            _payeeRepository = payeeRepository;
            _logger = logger;
        }

        [HttpGet("GetPayees/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetPayees(string userId)
        {
            var payees = await _payeeRepository.GetPayeesByUserIdAsync(userId);
            return Ok(payees);
        }


        [HttpGet("GetPayeesByPayeeId/{PayeeId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetPayeesByPayeeId(string PayeeId)
        {
            var payees = await _payeeRepository.GetPayeesByPayeeIdAsync(PayeeId);
            return Ok(payees);
        }


        [HttpPost("AddPayee")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> AddPayee([FromBody] PayeeDTO payeeDTO)
        {
            if (payeeDTO == null)
            {
                return BadRequest("Payee data is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == payeeDTO.UserId);
            if (userAccount == null)
            {
                return BadRequest("Failed to add payee. User account does not exist.");
            }

            var payeeAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == payeeDTO.PayeeId);
            if (payeeAccount == null)
            {
                return BadRequest("Failed to add payee. Payee account does not exist.");
            }


            var ExistingPayeeId = await _context.Payees.FirstOrDefaultAsync(a => (a.PayeeUserId == payeeDTO.PayeeId && a.UserId == payeeDTO.UserId));
            if (ExistingPayeeId != null)
            {
                return BadRequest("Failed to add payee. Payee Already Exist.");
            }

            try
            {
                var payee = new Payee
                {
                    UserId = payeeDTO.UserId,
                    PayeeUserId = payeeDTO.PayeeId,
                    Name = payeeDTO.Name,
                    AccountNumber = payeeAccount.AccountNumber,
                    NickName = payeeDTO.NickName
                };

                var result = await _payeeRepository.AddPayeeAsync(payee);
                if (result)
                {
                    return Ok("Payee added successfully");
                }

                return BadRequest("Failed to add payee.");
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging
                Console.WriteLine(ex.ToString());
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPut("UpdatePayee")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdatePayee([FromBody] PayeeDTO payeeDTO)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == payeeDTO.PayeeId);
            if (account == null)
            {
                return BadRequest("Failed to update payee. Payee or Payee account does not exist.");
            }

            var payee = new Payee
            {
                UserId = payeeDTO.UserId,
                PayeeUserId = payeeDTO.PayeeId,
                Name = payeeDTO.Name,
                AccountNumber = account.AccountNumber,
                NickName = payeeDTO.NickName
            };

            if (await _payeeRepository.UpdatePayeeAsync(payee))
            {
                return Ok("Payee updated successfully");
            }
            return BadRequest("Failed to update payee");
        }

        [HttpDelete("DeletePayee/{payeeId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> DeletePayee(string payeeId)
        {
            var result = await _payeeRepository.DeletePayeesByUserIdAsync(payeeId); // Assuming this method exists and returns bool
            if (result)
            {
                return Ok("Payee deleted successfully");
            }
            return NotFound("Payee not found");
        }

        [HttpGet("GetAllPayees")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllPayees()
        {
            var payees = await _payeeRepository.GetAllPayeesAsync();
            return Ok(payees);
        }
    }
}
