using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions; 
using System;
using System.IO;
using System.Threading.Tasks;

namespace BusinessLogic.FileUploadService
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, string destinationPath, string folderName, HttpRequest request);
    }

    public class FileUploadService : IFileUploadService
    {
        public async Task<string> UploadFileAsync(IFormFile file, string destinationPath, string folderName, HttpRequest request)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("El archivo no puede ser nulo o vacío.");
            }

            if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
            {
                throw new ArgumentException("Solo se permiten archivos PDF.");
            }

            // Asegurarse de que la carpeta exista
            if (!Directory.Exists(destinationPath))
            {
                Directory.CreateDirectory(destinationPath);
            }

            // Crear una ruta única para el archivo
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(destinationPath, fileName);

            // Guardar el archivo en la ruta especificada
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Construir la URL pública
            var baseUrl = UriHelper.BuildAbsolute(request.Scheme, request.Host); // "http://localhost:5000"
            var publicUrl = $"{baseUrl}/${folderName}/{fileName}";

            return publicUrl;
        }
    }
}
