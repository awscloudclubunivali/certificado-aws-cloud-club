const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

const ROOT_DIR = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT_DIR, "index.html");
const CSV_PATH = path.join(ROOT_DIR, "participantes.csv");
const OUTPUT_DIR = path.join(ROOT_DIR, "certificados-gerados");

// Configuração do transporte de email via variáveis de ambiente (GitHub Secrets)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function gerarPDF(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    await page.pdf({
      path: outputPath,
      width: "1170px",  // 1050px de conteúdo + 2x 60px padding
      height: "840px",  // 720px de conteúdo + 2x 60px padding
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

async function enviarEmail(destinatario, nomePart, pdfPath) {
  const remetente = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"AWS Cloud Club Univali" <${remetente}>`,
    to: destinatario,
    subject: "Seu Certificado - 1º Meetup AWS Cloud Club Univali",
    html: `
      <p>Olá, <strong>${nomePart}</strong>!</p>
      <p>
        Segue em anexo o seu certificado de participação no
        <strong>1º Meetup AWS Cloud Club Univali</strong>.
      </p>
      <p>
        Foi um prazer ter você conosco. Esperamos vê-lo nos próximos eventos!
      </p>
      <br>
      <p>Atenciosamente,<br>Equipe AWS Cloud Club Univali</p>
    `,
    attachments: [
      {
        filename: `Certificado_${nomePart.replace(/\s+/g, "_")}.pdf`,
        path: pdfPath,
      },
    ],
  });
}

function lerParticipantes() {
  return new Promise((resolve, reject) => {
    const participantes = [];

    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => participantes.push(row))
      .on("end", () => resolve(participantes))
      .on("error", reject);
  });
}

function prepararHTML(nomePart, dataEvento) {
  let html = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  // Converte os caminhos relativos das imagens para file:// absolutos
  // para que o Puppeteer consiga encontrá-las no runner do GitHub Actions
  const imagensDir = path.join(ROOT_DIR, "imagens").replace(/\\/g, "/");
  html = html.replace(/src="imagens\//g, `src="file://${imagensDir}/`);

  // Substitui as variáveis do template
  html = html.replace(/\{\{\s*NOME_PARTICIPANTE\s*\}\}/g, nomePart);
  html = html.replace(/\{\{\s*DATA_EVENTO\s*\}\}/g, dataEvento);

  return html;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const participantes = await lerParticipantes();
  console.log(`Encontrados ${participantes.length} participante(s) no CSV.\n`);

  for (const participante of participantes) {
    const nome = participante["NOME_PARTICIPANTE"]?.trim();
    const data = participante["DATA_EVENTO"]?.trim();
    const email = participante["Email"]?.trim();

    if (!nome || !data || !email) {
      console.warn(`Linha ignorada por dados incompletos:`, participante);
      continue;
    }

    const nomeArquivo = nome.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    const pdfPath = path.join(OUTPUT_DIR, `Certificado_${nomeArquivo}.pdf`);

    console.log(`Gerando certificado para: ${nome}`);
    const htmlContent = prepararHTML(nome, data);
    await gerarPDF(htmlContent, pdfPath);
    console.log(`  PDF gerado: ${pdfPath}`);

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log(`  Enviando email para: ${email}`);
      await enviarEmail(email, nome, pdfPath);
      console.log(`  Email enviado com sucesso.`);
    } else {
      console.log(`  Envio de email ignorado: variáveis SMTP não configuradas.`);
    }

    console.log("");
  }

  console.log("Processo concluído!");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
