using System.Linq;
using System.Threading.Tasks;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Repositories
{
    public class UserCredentialsRepository : IUserCredentialsRepository
    {
        private readonly BankDBContext _context;

        public UserCredentialsRepository(BankDBContext context)
        {
            _context = context;
        }

        public async Task<bool> ResetLoginPasswordAsync(string userId, string oldPassword, string newPassword)
        {
            var userCredentials = await _context.UserCredentials.FirstOrDefaultAsync(uc => uc.UserId == userId);

            if (userCredentials.LoginPassword != oldPassword) {
                Console.WriteLine("Invalid Password");
                return false;
            }

            userCredentials.LoginPassword = newPassword;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetUserNameAsync(string userId, string newUserName)
        {
            var userCredentials = await _context.UserCredentials.FirstOrDefaultAsync(uc => uc.UserId == userId);
            if (userCredentials == null)
                return false;

            // Assuming User model has a property for Name
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return false;

            user.Name = newUserName;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
