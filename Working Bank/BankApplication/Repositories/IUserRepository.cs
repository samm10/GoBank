using BankApplication.DTO;
using BankApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApplication.Repositories
{
    public interface IUserRepository
    {
        // Task<string> GetUserByIdAndPasswordAsync(string userId, string password);
        Task<bool> AddUserAsync(User user, UserCredentials ucred);
        Task<User> GetUserById(string userId);
        Task<List<User>> GetAllUser();
        Task<bool> RemoveUserAsync(string userId);
        Task<bool> UpdateUserAsync(User user);
        string GenerateUniqueUserId(string name);
        Task<User> GetUserWithTransactionsAsync(string userId);
        Task<User> GetUserWithPayeesAsync(string userId);
        string GenerateRandomSuffix();
        Task<List<User>> SearchUsersByUserIdAsync(string searchTerm);
    }

    public interface IAccountRepository
    {
        Task<Account> GetAccountByIdAsync(int id);
        Task<IEnumerable<Account>> GetAllAccountsAsync();
        Task<bool> AddAccountAsync(Account account);
        Task<bool> UpdateAccountAsync(Account account);
        Task<bool> DeleteAccountByUserIdAsync(string userId);
        Task<bool> AddBalanceAsync(string userId, double amount);
        string GenerateUniqueAccountNumber();
        Task<User> GetUserByUserIdAsync(string userId);
        Task<Account> GetAccountUserIdAsync(string userId);
    }


    public interface IAdminRepository
    {
        Task<bool> LoginAdminAsync(string userId, string password);
        Task<User> GetUserByIdAsync(string userId);
        string GenerateUniqueAdminId(string Name);
        Task<bool> AddAdminAsync(Admin admin, UserCredentials adminCred);
        Task<bool> ApproveUser(string userId);
        Task<List<Admin>> GetAllAdminsAsync();
        Task<Admin> GetAdminByIdAsync(string adminId);
        Task<bool> UpdateAdminAsync(Admin admin);
    }


    public interface IPayeeRepository
    {
        Task<bool> PayeeExists(string id);
        Task<List<Payee>> GetPayeesByUserIdAsync(string userId);
        Task<Payee> GetPayeeByIdAsync(string id);
        Task<bool> AddPayeeAsync(Payee payee);
        Task<bool> UpdatePayeeAsync(Payee payee);
        Task<bool> DeletePayeesByUserIdAsync(string Id);
        Task<List<Payee>> GetAllPayeesAsync();
        Task<List<Payee>> GetPayeesByPayeeIdAsync(string payeeId);
    }

    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetTransactionsByUserIdAsync(string userId);
        Task<Transaction> GetTransactionByIdAsync(int id);
        Task<string> AddTransactionAsync(Transaction transaction);
        Task<bool> UpdateTransactionAsync(TransactionUpdateDTO transaction);
        Task<bool> DeleteTransactionAsync(int Id);
        Task<List<Transaction>> GetAllTransactionsAsync();

        Task<bool> CheckUserAccountExistsAsync(string userId);


        Task<bool> CheckPayeeAccountExistsAsync(string payeeUserId);


        Task<bool> CheckSufficientBalanceAsync(string userId, double amount);
       
    }


    public interface IUserCredentialsRepository
    {
        Task<bool> ResetLoginPasswordAsync(string userId, string oldPassword, string newPassword);
        Task<bool> ResetUserNameAsync(string userId, string newUserName);
    }

}
