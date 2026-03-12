const fs = require("fs");
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");

/**
 * Gera um PDF a partir de conteúdo HTML e salva no caminho indicado.
 * @param {string} htmlContent - HTML completo do certificado.
 * @param {string} outputPath  - Caminho de saída do arquivo PDF.
 */
async function gerarPDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    timeout: 60000,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 960, deviceScaleFactor: 1 });
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pngBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 1300, height: 960 },
    });

    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    const pdfPage = pdfDoc.addPage([1300, 960]);
    pdfPage.drawImage(pngImage, { x: 0, y: 0, width: 1300, height: 960 });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
  } finally {
    await browser.close();
  }
}

module.exports = { gerarPDF };
