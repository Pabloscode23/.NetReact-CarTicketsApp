using IronOcr;
using Microsoft.AspNetCore.Http;
using System.IO;

public class UploadImageService
{
    public string ProcessImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
            throw new ArgumentException("No se ha proporcionado una imagen.");

        // Guardar la imagen temporalmente
        var filePath = Path.GetTempFileName();
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            image.CopyTo(stream);
        }

        // Procesar la imagen con IronOCR
        var ocr = new IronTesseract();
        ocr.Language = OcrLanguage.Spanish; // Ajustar el idioma si es necesario
        var result = ocr.Read(filePath);

        // Buscar el número de placa
        var detectedPlate = DetectLicensePlate(result.Text);
        if (string.IsNullOrWhiteSpace(detectedPlate))
        {
            throw new Exception("No se pudo detectar el número de placa.");
        }

        return detectedPlate;
    }

    private string DetectLicensePlate(string text)
    {
        var regex = new System.Text.RegularExpressions.Regex(@"\b[A-Z]{3}\d{3}\b");
        var match = regex.Match(text);
        return match.Success ? match.Value : string.Empty;
    }
}
