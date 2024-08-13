using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Repositories
{
    public class PayeeRepository : IPayeeRepository
    {
        private readonly BankDBContext _context;
        private readonly ILogger<PayeeRepository> _logger;


        public PayeeRepository(BankDBContext context, ILogger<PayeeRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Payee>> GetAllPayeesAsync()
        {
            return await _context.Payees.ToListAsync();
        }


        public async Task<bool> PayeeExists(string id)
        {
            return await _context.Payees.AnyAsync(p => p.PayeeUserId == id);
        }

        

        public async Task<List<Payee>> GetPayeesByUserIdAsync(string userId)
        {
            return await _context.Payees.Where(p => p.UserId == userId).ToListAsync();
        }

        public async Task<List<Payee>> GetPayeesByPayeeIdAsync(string payeeId)
        {
            return await _context.Payees.Where(p => p.PayeeUserId == payeeId).ToListAsync();
        }

        public async Task<Payee> GetPayeeByIdAsync(string id)
        {
            return await _context.Payees.FirstOrDefaultAsync(p => p.PayeeUserId == id);
        }

        public async Task<bool> AddPayeeAsync(Payee payee)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == payee.UserId);

                if (user == null)
                {
                    _logger.LogWarning("User not found for UserId: {UserId}", payee.UserId);
                    return false;
                }

                user.Payees.Add(payee);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding payee for UserId: {UserId}", payee.UserId);
                throw; // Rethrow or handle accordingly
            }
        }

        public async Task<bool> UpdatePayeeAsync(Payee payee)
        {
            // Find the existing payee by UserId
            var existingPayee = await _context.Payees.FirstOrDefaultAsync(p => p.UserId == payee.UserId);

            if (existingPayee == null)
                return false; // Return false if payee not found

            existingPayee.Name = payee.Name;
            existingPayee.AccountNumber = payee.AccountNumber;
            existingPayee.NickName = payee.NickName;

            // Save changes to the database
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePayeesByUserIdAsync(string Id)
        {
            var payees = await _context.Payees.Where(p => p.PayeeUserId == Id).ToListAsync();
            if (payees == null || payees.Count == 0)
            {
                return false;
            }

            _context.Payees.RemoveRange(payees);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
