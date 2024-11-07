using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadImageController : ControllerBase
    {
        private readonly UploadImageService _uploadImageService;

        // Inyectar el servicio de lógica de negocio en el controlador
        public UploadImageController(UploadImageService uploadImageService)
        {
            _uploadImageService = uploadImageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            try
            {
                var detectedPlate = _uploadImageService.ProcessImage(image);
                return Ok(new { message = $"Multa generada para la placa: {detectedPlate}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al procesar la imagen: {ex.Message}");
            }
        }
    }
}
