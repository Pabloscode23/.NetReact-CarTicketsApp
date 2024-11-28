using DataAccess.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessLogic
{
    public class UserService
    {
        private readonly AppDbContext _context;

        // Constructor to inject the AppDbContext
        public UserService(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Method to get user by ID
        public async Task<User> GetUserByIdAsync(string userId)
        {
            // Fetch user by userId from the context (database)
            var user = await _context.Users.FindAsync(userId); // Use FindAsync to get user by ID

            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            return user;
        }

        // Method to get user by email
        public User GetUserByEmail(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                throw new Exception($"User with email {email} not found.");
            }

            return user;
        }

        // Method to add a new user
        public async Task<User> AddUserAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            // Add the user to the database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }
        // Method to delete a user by ID
        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
