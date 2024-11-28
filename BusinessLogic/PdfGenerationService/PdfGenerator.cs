using PuppeteerSharp;
using System.Threading.Tasks;

namespace BusinessLogic.PdfGenerationService
{
    public interface IPdfGenerator
    {
        Task<byte[]> GeneratePdfAsync(string html);
    }

    public class PdfGenerator : IPdfGenerator
    {
        public PdfGenerator()
        {
           
            var browserFetcher = new BrowserFetcher();
            browserFetcher.DownloadAsync().Wait();
        }

        public async Task<byte[]> GeneratePdfAsync(string html)
        {
            var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true
            });

            try
            {
                using (var page = await browser.NewPageAsync())
                {
                    await page.SetContentAsync(html);
                    var pdfContent = await page.PdfDataAsync();

                    return pdfContent;
                }
            }
            finally
            {
                await browser.CloseAsync();
            }
        }
    }
}
