using System.Linq;
using System.Threading.Tasks;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly BankDBContext _context;

        public AdminRepository(BankDBContext context)
        {
            _context = context;
        }


        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            return await _context.Admins.ToListAsync();
        }

        public async Task<bool> LoginAdminAsync(string userId, string password)
        {
            return await _context.Admins.AnyAsync(a => a.Adminid == userId && a.Password == password);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public string GenerateUniqueAdminId(string name)
        {
            string AdminId;
            do
            {
                string randomSuffix = GenerateRandomSuffix();
                AdminId = $"{name.ToLower()}{randomSuffix}";
            } while (_context.Admins.Any(u => u.Adminid == AdminId));

            return AdminId;
        }

        public string GenerateRandomSuffix()
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, 4)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<bool> UpdateAdminAsync(Admin admin)
        {
            _context.Admins.Update(admin);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<Admin> GetAdminByIdAsync(string adminId)
        {
            return await _context.Admins.FindAsync(adminId);
        }

        public async Task<bool> AddAdminAsync(Admin admin, UserCredentials adminCred)
        {
            if(_context.Admins.Any(u=> u.Adminid == admin.Adminid)) return false;

            _context.Admins.Add(admin);
            _context.UserCredentials.Add(adminCred);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveUser(string userId)
        {
            var userExist = await _context.Users.FirstOrDefaultAsync(a => a.UserId == userId);

            if (userExist!=null)
            {
                userExist.Status = "Approved";
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
