using BankApplication.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BankApplication.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly BankDBContext _context;

        public AccountRepository(BankDBContext context)
        {
            _context = context;
        }

        public async Task<Account> GetAccountByIdAsync(int id)
        {
            return await _context.Accounts.FindAsync(id);
        }

        public async Task<IEnumerable<Account>> GetAllAccountsAsync()
        {
            return await _context.Accounts.ToListAsync();
        }

        public async Task<bool> AddAccountAsync(Account account)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == account.UserId);
            if (user == null)
            {
                return false; 
            }

            if (user.Status == "Approved")
            {
                account.AccountNumber = GenerateUniqueAccountNumber();
                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();

                return true;    
            }

            return false;
        }

        public async Task<bool> AddBalanceAsync(string userId, double amount)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == userId);

            if (account == null)
                return false; // User account not found

            var user = await _context.Users.FirstOrDefaultAsync(p => p.UserId == userId);

            account.AccountBalance += amount;
            user.Balance += amount;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateAccountAsync(Account account)
        {
            // Find the existing account by UserId
            var existingAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == account.UserId);

            if (existingAccount == null)
                return false; // Return false if account not found

            // Update properties of existingAccount with new values
            
            existingAccount.IFSC = account.IFSC;
            existingAccount.BranchName = account.BranchName;
            existingAccount.AccountType = account.AccountType;
            existingAccount.AddressLine = account.AddressLine;
            existingAccount.City = account.City;
            existingAccount.State = account.State;
            existingAccount.PostalCode = account.PostalCode;

            // Save changes to the database
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAccountByUserIdAsync(string userId)
        {
            var accounts = _context.Accounts.Where(a => a.UserId == userId).ToList();
            if (!accounts.Any())
            {
                return false;
            }

            _context.Accounts.RemoveRange(accounts);
            await _context.SaveChangesAsync();
            return true;
        }

        public string GenerateUniqueAccountNumber()
        {
            string accountNumber;
            Random random = new Random();

            do
            {
                accountNumber = new string(Enumerable.Repeat("0123456789", 12)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
            } while (_context.Accounts.Any(a => a.AccountNumber == accountNumber));

            return accountNumber;
        }

        public async Task<User> GetUserByUserIdAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            return user;
        }

        public async Task<Account> GetAccountUserIdAsync(string userId)
        {
            try
            {
                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == userId);
                if (account == null)
                {
                    Console.WriteLine($"Account not found for userId: {userId}");
                }
                return account;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching account for userId: {userId}, Exception: {ex.Message}");
                throw;
            }
        }

    }
}
