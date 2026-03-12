const fs = require("fs");
const path = require("path");

const { lerCSV } = require("./csv");
const { gerarPDF } = require("./pdf");
const { criarTransporte, enviarEmail } = require("./mailer");
const eventConfig = require("../config/event");

const ROOT_DIR = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT_DIR, "templates", "certificado.html");
const DATA_DIR = path.join(ROOT_DIR, "data");
const OUTPUT_DIR = path.join(ROOT_DIR, "certificados-gerados");

const MODE = (process.env.MODE || "participante").toLowerCase();

if (!["participante", "organizador"].includes(MODE)) {
  console.error(
    `❌ Modo inválido: "${MODE}". Use MODE=participante ou MODE=organizador.`
  );
  process.exit(1);
}

const CSV_PATH = path.join(DATA_DIR, `${MODE}s.csv`);

/**
 * Preenche o template HTML com os dados da pessoa e as configurações do evento.
 */
function prepararHTML(nome, data) {
  let html = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  html = html.replace(/\{\{\s*NOME_PARTICIPANTE\s*\}\}/g, nome);
  html = html.replace(/\{\{\s*DATA_EVENTO\s*\}\}/g, data);
  html = html.replace(/\{\{\s*LOCAL_EVENTO\s*\}\}/g, eventConfig.local);
  html = html.replace(
    /\{\{\s*CORPO_CERTIFICADO\s*\}\}/g,
    eventConfig.corpoTexto[MODE]
  );
  html = html.replace(/\{\{\s*SIGNER_NAME\s*\}\}/g, eventConfig.assinante.nome);
  html = html.replace(/\{\{\s*SIGNER_ROLE\s*\}\}/g, eventConfig.assinante.cargo);
  html = html.replace(
    /\{\{\s*SIGNER_IMAGE\s*\}\}/g,
    eventConfig.assinante.imagemUrl
  );
  html = html.replace(/\{\{\s*LOGO_URL\s*\}\}/g, eventConfig.logoUrl);

  return html;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV não encontrado: ${CSV_PATH}`);
    process.exit(1);
  }

  const modeLabel = MODE === "participante" ? "Participantes" : "Organizadores";
  console.log(`\n=== Gerando certificados: ${modeLabel} ===\n`);

  const pessoas = await lerCSV(CSV_PATH);
  console.log(`Encontrados ${pessoas.length} registro(s).\n`);

  if (pessoas.length === 0) {
    console.log("Nenhum registro encontrado. Verifique o CSV.");
    return;
  }

  const subdir = path.join(OUTPUT_DIR, `${MODE}s`);
  fs.mkdirSync(subdir, { recursive: true });

  const transporte = criarTransporte();
  const enviarEmailAtivado = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

  const errosEmail = [];

  for (const pessoa of pessoas) {
    const nome = pessoa["NOME_PARTICIPANTE"]?.trim();
    const data = pessoa["DATA_EVENTO"]?.trim();
    const email = pessoa["Email"]?.trim();

    if (!nome || !data || !email) {
      console.warn("⚠️  Linha ignorada por dados incompletos:", pessoa);
      continue;
    }

    const nomeArquivo = nome
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const pdfPath = path.join(subdir, `Certificado_${nomeArquivo}.pdf`);

    console.log(`📄 Gerando: ${nome}`);
    const html = prepararHTML(nome, data);
    await gerarPDF(html, pdfPath);
    console.log(`   ✅ Salvo em: ${path.relative(ROOT_DIR, pdfPath)}`);

    if (enviarEmailAtivado) {
      console.log(`   📧 Enviando para: ${email}`);
      try {
        await enviarEmail(transporte, email, nome, pdfPath, eventConfig);
        console.log(`   ✅ Email enviado.`);
      } catch (err) {
        console.error(`   ❌ Falha ao enviar email: ${err.message}`);
        errosEmail.push({ nome, email, erro: err.message });
      }
    } else {
      console.log(`   ⏭️  Email ignorado (SMTP não configurado).`);
    }

    console.log("");
  }

  if (errosEmail.length > 0) {
    console.error(`\n❌ ${errosEmail.length} email(s) não enviados:`);
    for (const { nome, email, erro } of errosEmail) {
      console.error(`   - ${nome} <${email}>: ${erro}`);
    }
    process.exit(1);
  }

  console.log(`=== ✅ Concluído: ${modeLabel} ===\n`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
