const fs = require("fs");
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");

/**
 * Cria e retorna uma instância do browser Puppeteer configurada.
 * @returns {Promise<import('puppeteer').Browser>}
 */
async function criarBrowser() {
  return puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    timeout: 60000,
  });
}

/**
 * Gera um PDF a partir de conteúdo HTML e salva no caminho indicado.
 * @param {import('puppeteer').Browser} browser - Instância do browser Puppeteer.
 * @param {string} htmlContent - HTML completo do certificado.
 * @param {string} outputPath  - Caminho de saída do arquivo PDF.
 */
async function gerarPDF(browser, htmlContent, outputPath) {
  let page;
  try {
    page = await browser.newPage();
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
    if (page) await page.close();
  }
}

module.exports = { criarBrowser, gerarPDF };
