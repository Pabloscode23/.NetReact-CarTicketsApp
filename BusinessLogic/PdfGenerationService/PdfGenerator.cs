using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.PdfGenerationService
{

    public interface IPdfGenerator
    {
        void GeneratePdf();
    }
    public class PdfGenerator
    {
        public PdfGenerator() { }
        public async Task<byte[]> GeneratePdf()
        {
            var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true
            });
            using ( var page = await browser.NewPageAsync())
            {
                await page.SetContentAsync("<h1>PDF Report</h1>");
                var result = await page.GetContentAsync();
                
                var pdfContent = await page.PdfDataAsync();

                await browser.CloseAsync();

                return pdfContent;
            }
        }
    }
}
