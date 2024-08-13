using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace BankApplication.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly BankDBContext _context;
        private readonly IConfiguration _configuration;

        public UserRepository(BankDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        
        public async Task<User> GetUserById(string userId)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == userId);
        }


        public async Task<List<User>> GetAllUser()
        {
            return _context.Users.ToList();
        }

        public async Task<User> GetUserWithTransactionsAsync(string userId)
        {
            return await _context.Users
                .Include(u => u.Transactions)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }
        
        public async Task<User> GetUserWithPayeesAsync(string userId)
        {
            return await _context.Users
                .Include(u => u.Payees)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<bool> AddUserAsync(User user, UserCredentials ucred)
        {
            if(_context.Users.Any(u=> u.Email == user.Email)) return false;
            
            _context.Users.Add(user);
            _context.UserCredentials.Add(ucred);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> RemoveUserAsync(string userId)
        {
            var user = _context.Users.Where(u=> u.UserId==userId);
            var userCredential = _context.UserCredentials.Where(u => u.UserId == userId);
            var payee = _context.Payees.Where(u => u.PayeeUserId == userId);

            if (user == null) return false;

            if (userCredential == null) return false;

            _context.Users.RemoveRange(user);
            _context.UserCredentials.RemoveRange(userCredential);
            _context.Payees.RemoveRange(payee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            // Find the existing user by UserId
            var existingUser = await _context.Users.FindAsync(user.UserId);

            if (existingUser == null)
                return false; // Return false if user not found

            // Update properties of existingUser with new values
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Age = user.Age;
            existingUser.Gender = user.Gender;
            existingUser.AccountType = user.AccountType;

            // Save changes to the database
            await _context.SaveChangesAsync();
            return true;
        }

        public string GenerateUniqueUserId(string name)
        {
            string userId;
            do
            {
                string randomSuffix = GenerateRandomSuffix();
                userId = $"{name.ToLower()}{randomSuffix}";
            } while (_context.Users.Any(u => u.UserId == userId));

            return userId;
        }

        public string GenerateRandomSuffix()
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, 4)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        // UserRepository.cs
        public async Task<List<User>> SearchUsersByUserIdAsync(string searchTerm)
        {
            return await _context.Users
                .Where(u => u.UserId.StartsWith(searchTerm))
                .ToListAsync();
        }


    }

}
