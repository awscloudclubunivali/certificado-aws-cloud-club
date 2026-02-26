<div align="center">

<img src="https://aws-cloud-club-univali.s3.sa-east-1.amazonaws.com/imagens/logo-mascote.png" width="120" alt="AWS Cloud Club Mascote"/>

# Gerador de Certificados — AWS Cloud Club Univali

Geração automática de certificados em PDF a partir de um CSV e envio por email via **GitHub Actions**.

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pptr.dev)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com)

</div>

---

## Como funciona

```
participantes.csv  →  HTML template  →  PDF (Puppeteer)  →  Email (Nodemailer)
```

1. Lê os participantes do arquivo `participantes.csv`
2. Substitui as variáveis `{{ NOME_PARTICIPANTE }}` e `{{ DATA_EVENTO }}` no template HTML
3. Renderiza o certificado com Puppeteer (Chromium headless) e exporta como PDF
4. Envia o PDF como anexo de email para cada participante
5. Os PDFs ficam disponíveis como artefato na aba **Actions** por 30 dias

---

## Estrutura do Projeto

```
certificado-cloud-club/
├── .github/
│   └── workflows/
│       └── generate-certificates.yml   # Pipeline de geração e envio
├── scripts/
│   └── generate-certificates.js        # Script principal Node.js
├── imagens/
│   ├── logo-mascote.png                # Logo do clube
│   └── assinatura-henrique.png         # Assinatura do capitão
├── index.html                          # Template do certificado
├── participantes.csv                   # Lista de participantes
├── package.json
└── .gitignore
```

---

## Formato do CSV

O arquivo `participantes.csv` deve conter exatamente estas três colunas:

```csv
NOME_PARTICIPANTE,DATA_EVENTO,Email
João Silva,25 de fevereiro de 2026,joao@email.com
Maria Santos,25 de fevereiro de 2026,maria@email.com
```

---

## Configuração dos Secrets (GitHub)

Acesse **Settings → Secrets and variables → Actions** e adicione:

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Seu email | `seu@gmail.com` |
| `SMTP_PASS` | App Password | `abcd efgh ijkl mnop` |
| `SMTP_FROM` | *(opcional)* Email remetente | `noreply@gmail.com` |

> **Importante:** Use Gmail com [App Password](https://myaccount.google.com/apppasswords) (requer 2FA ativo). Contas Outlook pessoais **não** suportam autenticação SMTP básica.

---

## Como executar

### Via GitHub Actions (recomendado)

**Disparo manual:**

1. Vá na aba **Actions** do repositório
2. Selecione **Gerar e Enviar Certificados**
3. Clique em **Run workflow**
4. Escolha se deseja enviar emails (`true` / `false`)

**Disparo automático:**

O workflow é disparado automaticamente ao fazer push do `participantes.csv` na branch `main` (gera os PDFs sem enviar emails).

### Localmente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional — pula envio de email se ausente)
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USER=seu@gmail.com
export SMTP_PASS=sua-app-password

# Gerar certificados
npm run generate
```

Os PDFs serão salvos na pasta `certificados-gerados/`.

---

## Variáveis do Template

O `index.html` usa as seguintes variáveis substituídas automaticamente pelo script:

| Variável | Descrição |
|----------|-----------|
| `{{ NOME_PARTICIPANTE }}` | Nome completo do participante |
| `{{ DATA_EVENTO }}` | Data do evento (ex: `25 de fevereiro de 2026`) |

---

## Tech Stack

| Ferramenta | Uso |
|------------|-----|
| [Puppeteer](https://pptr.dev) | Renderização HTML → PDF via Chromium headless |
| [Nodemailer](https://nodemailer.com) | Envio de emails com anexo |
| [csv-parser](https://www.npmjs.com/package/csv-parser) | Leitura do arquivo CSV |
| [GitHub Actions](https://github.com/features/actions) | Pipeline CI/CD de geração e envio |

---

<div align="center">

Feito com ☁️ pelo **AWS Cloud Club Univali**

</div>
