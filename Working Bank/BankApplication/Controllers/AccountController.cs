using BankApplication.DTO;
using BankApplication.Models;
using BankApplication.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using BankApplication.Services;
using Microsoft.AspNetCore.Authorization;

namespace BankApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;
        private readonly EmailService _emailService;

        public AccountController(IAccountRepository accountRepository, EmailService emailService)
        {
            _accountRepository = accountRepository;
            _emailService = emailService;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAccountByUserId(string userId)
        {
            try
            {
                var account = await _accountRepository.GetAccountUserIdAsync(userId);
                if (account == null)
                {
                    return NotFound("Account not found");
                }

                return Ok(account);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAccountByUserId for userId: {userId}, Exception: {ex.Message}");
                return StatusCode(500, "Server error");
            }
        }

        [HttpGet("AllAccounts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var accounts = await _accountRepository.GetAllAccountsAsync();
            return Ok(accounts);
        }

        [HttpPost("AddAccount")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> AddAccount([FromBody] AccountDTO accountCreateRequest)
        {
            try
            {
                var user = await _accountRepository.GetUserByUserIdAsync(accountCreateRequest.UserId);

                var accountExist = await _accountRepository.GetAccountUserIdAsync(accountCreateRequest.UserId);

                if (accountExist != null) {
                    return BadRequest("Account already exists");
                }

                if (user == null || user.Status != "Approved")
                {
                    return BadRequest("Account could not be added. Ensure UserId exists and User is approved.");
                }

                var account = new Account
                {
                    UserId = accountCreateRequest.UserId,
                    IFSC = accountCreateRequest.IFSC,
                    BranchName = accountCreateRequest.BranchName,
                    AccountType = accountCreateRequest.AccountType,
                    AddressLine = accountCreateRequest.AddressLine,
                    City = accountCreateRequest.City,
                    State = accountCreateRequest.State,
                    PostalCode = accountCreateRequest.PostalCode
                };

                if (await _accountRepository.AddAccountAsync(account))
                {
                    await _emailService.SendEmailAsync(user.Email, "Congratulations on Your Successful Account Registration", $"Welcome to our bank! Your Account registration was successful, Below are the details for your bank account \n\n\n UserId: {account.UserId} \n Account Number: {account.AccountNumber} \n IFSC: {account.IFSC} \n Branch: {account.BranchName} \n\n\n Thanks and Regards,\nASP BANK MUMBAI");
                    return Ok("Account added successfully");
                }
                return BadRequest("Account could not be added. Ensure UserId exists or User is not Approved.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Server Error");
            }
        }


        [HttpPost("AddBalance")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> AddBalance([FromBody] AddBalanceDTO addBalanceDTO)
        {
            try
            {
                if (await _accountRepository.AddBalanceAsync(addBalanceDTO.UserId, addBalanceDTO.Amount))
                {
                    return Ok("Balance added successfully");
                }
                return BadRequest("Failed to add balance. Ensure UserId exists.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Server Error");
            }
        }

        [HttpPut("UpdateAccount")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdateAccount([FromBody] AccountDTO  accountCreateRequest)
        {
            var account = new Account
            {
                UserId = accountCreateRequest.UserId,
                IFSC = accountCreateRequest.IFSC,
                BranchName = accountCreateRequest.BranchName,
                AccountType = accountCreateRequest.AccountType,
                AddressLine = accountCreateRequest.AddressLine,
                City = accountCreateRequest.City,
                State = accountCreateRequest.State,
                PostalCode = accountCreateRequest.PostalCode
            };
            
            if (await _accountRepository.UpdateAccountAsync(account))
            {
                return Ok(account);
            }
            return NotFound("Account not found");
        }


        [HttpDelete("DeleteAccount/{Userid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(string Userid)
        {
            if (await _accountRepository.DeleteAccountByUserIdAsync(Userid))
            {
                return Ok("Account deleted");
            }
            return NotFound("Account not found");
        }
    }
}
