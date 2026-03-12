const nodemailer = require("nodemailer");

/**
 * Cria e retorna um transporte Nodemailer configurado via variáveis de ambiente.
 */
function criarTransporte() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Envia o certificado PDF por email para um destinatário.
 * @param {object} transporte  - Instância do transporte Nodemailer.
 * @param {string} destinatario - Endereço de email do destinatário.
 * @param {string} nomePessoa   - Nome da pessoa (para personalizar o email).
 * @param {string} pdfPath      - Caminho absoluto do arquivo PDF gerado.
 * @param {object} config       - Configuração do evento (config/event.js).
 */
async function enviarEmail(transporte, destinatario, nomePessoa, pdfPath, config) {
  const remetente = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporte.sendMail({
    from: `"${config.email.nomeRemetente}" <${remetente}>`,
    to: destinatario,
    subject: config.email.assunto,
    html: `
      <p>Olá, <strong>${nomePessoa}</strong>!</p>
      <p>
        Segue em anexo o seu certificado de participação no
        <strong>${config.nomeEvento}</strong>.
      </p>
      <p>Foi um prazer ter você conosco. Esperamos vê-lo nos próximos eventos!</p>
      <br>
      <p>Atenciosamente,<br>${config.email.nomeRemetente}</p>
    `,
    attachments: [
      {
        filename: `Certificado_${nomePessoa.replace(/\s+/g, "_")}.pdf`,
        path: pdfPath,
      },
    ],
  });
}

module.exports = { criarTransporte, enviarEmail };
