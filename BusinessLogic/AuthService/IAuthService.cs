using DataAccess.Models;
public interface IAuthService
{
    string GenerateValidationCode();
    Task<bool> ValidateCode(string code, string email, DateTime actualTime);
    Task<string> CodeSendingHandlingAsync(string email, string type); // Debe ser asíncrono
    string GenerateJwtToken(User user);
}
