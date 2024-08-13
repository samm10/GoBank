using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BankApplication.DTO;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly BankDBContext _context;

        public TransactionRepository(BankDBContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAsync(string userId)
        {
            return await _context.Transactions.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<Transaction> GetTransactionByIdAsync(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }


        public async Task<bool> CheckUserAccountExistsAsync(string userId)
        {
            return await _context.Accounts.AnyAsync(a => a.UserId == userId);
        }

        public async Task<bool> CheckPayeeAccountExistsAsync(string payeeUserId)
        {
            return await _context.Accounts.AnyAsync(a => a.UserId == payeeUserId);
        }

        public async Task<bool> CheckSufficientBalanceAsync(string userId, double amount)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == userId);
            return account != null && account.AccountBalance >= amount;
        }

        public async Task<string> AddTransactionAsync(Transaction transaction)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == transaction.UserId);

            if (user == null)
            {
                return "UserId does not exist";
            }

            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == transaction.UserId);

            if (account == null || account.AccountBalance < transaction.Amount)
            {
                transaction.date = DateTime.Now;
                transaction.Status = "Insufficient Balance";
                user.Transactions.Add(transaction);

                await _context.SaveChangesAsync();

                return "You have insufficient balance to make this transaction";
            }

            var payeeExists = await _context.Users.FirstOrDefaultAsync(p => p.UserId == transaction.PayeeUserId);

            if (payeeExists == null)
            {
                return "PayeeId does not exist";
            }

            var Payeeaccount = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == transaction.PayeeUserId);

            if (Payeeaccount == null)
            {
                return "Payee bank account not found";
            }

            account.AccountBalance -= transaction.Amount;
            Payeeaccount.AccountBalance += transaction.Amount;

            user.Balance -= transaction.Amount;
            payeeExists.Balance += transaction.Amount;

            transaction.date = DateTime.Now;
            transaction.Status = "Completed";
            user.Transactions.Add(transaction);

            await _context.SaveChangesAsync();

            return "Transaction Successful";
        }
        public async Task<bool> UpdateTransactionAsync(TransactionUpdateDTO transaction)
        {
            // Find the existing transaction by UserId
            var existingTransaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == transaction.TransactionID);

            if (existingTransaction == null)
                return false; 
            existingTransaction.TransactionType = transaction.TransactionType;
            existingTransaction.date = transaction.Date;
            existingTransaction.Description = transaction.Description;
            existingTransaction.Status = transaction.Status;

            
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteTransactionAsync(int Id)
        {
            var transaction = _context.Transactions.Where(id=> id.Id== Id);
            if (transaction == null)
                return false;
            _context.Transactions.RemoveRange(transaction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions.ToListAsync();
        }


    }
}
