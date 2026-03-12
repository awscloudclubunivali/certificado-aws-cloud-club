<div align="center">

# Gerador de Certificados — AWS Cloud Club

Geração automática de certificados em PDF a partir de CSVs e envio por email, com suporte a **participantes** e **organizadores**, via **GitHub Actions** ou localmente.

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pptr.dev)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

</div>

---

## Como funciona

```
data/participantes.csv  ──┐
                           ├──  config/event.js  ──  templates/certificado.html
data/organizadores.csv  ──┘         │
                                     ▼
                              PDF (Puppeteer)  →  Email (Nodemailer)
```

1. Lê os dados do CSV correspondente ao modo (`participante` ou `organizador`)
2. Preenche o template HTML com as variáveis de cada pessoa + configurações do evento
3. Renderiza o certificado com Puppeteer (Chromium headless) e exporta como PDF
4. Envia o PDF como anexo de email (se SMTP configurado)
5. Os PDFs ficam disponíveis como artefato na aba **Actions** por 30 dias

---

## Estrutura do Projeto

```
certificado-cloud-club/
├── config/
│   └── event.js                        # ⚙️  Configuração do evento (edite aqui)
├── data/
│   ├── participantes.csv               # 👥 Lista de participantes
│   └── organizadores.csv               # 🛠️ Lista de organizadores
├── templates/
│   └── certificado.html                # 🎨 Template visual do certificado
├── scripts/
│   ├── index.js                        # 🚀 Ponto de entrada (orquestrador)
│   ├── pdf.js                          # 📄 Geração de PDF via Puppeteer
│   ├── mailer.js                       # 📧 Envio de email via Nodemailer
│   └── csv.js                          # 📊 Leitura de CSV
├── certificados-gerados/
│   ├── participantes/                  # 📄 PDFs gerados para participantes
│   └── organizadores/                  # 📄 PDFs gerados para organizadores
├── .github/
│   └── workflows/
│       └── generate-certificates.yml   # 🤖 Pipeline GitHub Actions
├── .env.example                        # 📋 Variáveis de ambiente (referência)
├── Makefile                            # 🛠️  Comandos simplificados
└── package.json
```

---

## Adaptando para um novo evento

Edite **apenas** o arquivo `config/event.js`:

```js
module.exports = {
  nomeEvento: "2º Meetup AWS Cloud Club Univali",
  local: "Itajaí - SC",
  email: {
    assunto: "Seu Certificado - 2º Meetup AWS Cloud Club Univali",
    nomeRemetente: "AWS Cloud Club Univali",
  },
  assinante: {
    nome: "Henrique Zimermann",
    cargo: "AWS Cloud Club Captain",
    imagemUrl: "https://...",        // PNG com fundo transparente
  },
  logoUrl: "https://...",            // URL do logo/mascote
  corpoTexto: {
    participante: `Participou com êxito do evento <strong>...</strong>.`,
    organizador:  `Participou como <strong>Membro da Organização</strong> ...`,
  },
};
```

Depois, atualize os CSVs em `data/` e execute.

---

## Formato dos CSVs

Ambos os arquivos seguem o mesmo formato com três colunas obrigatórias:

```csv
NOME_PARTICIPANTE,DATA_EVENTO,Email
João Silva,10 de março de 2026,joao@email.com
Maria Santos,10 de março de 2026,maria@email.com
```

---

## Variáveis do Template HTML

O `templates/certificado.html` suporta as seguintes variáveis substituídas automaticamente:

| Variável | Origem |
|----------|--------|
| `{{ NOME_PARTICIPANTE }}` | CSV — nome da pessoa |
| `{{ DATA_EVENTO }}` | CSV — data do evento |
| `{{ LOCAL_EVENTO }}` | `config/event.js` → `local` |
| `{{ CORPO_CERTIFICADO }}` | `config/event.js` → `corpoTexto[modo]` |
| `{{ SIGNER_NAME }}` | `config/event.js` → `assinante.nome` |
| `{{ SIGNER_ROLE }}` | `config/event.js` → `assinante.cargo` |
| `{{ SIGNER_IMAGE }}` | `config/event.js` → `assinante.imagemUrl` |
| `{{ LOGO_URL }}` | `config/event.js` → `logoUrl` |

---

## Como executar localmente

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas credenciais SMTP (opcional — sem SMTP o envio é ignorado)
```

### 2. Instalar dependências

```bash
make install
# ou: npm install
```

### 3. Gerar certificados

```bash
make participantes       # Somente participantes
make organizadores       # Somente organizadores
make all                 # Ambos

# ou via npm:
npm run generate:participantes
npm run generate:organizadores
npm run generate:all
```

Os PDFs são salvos em `certificados-gerados/participantes/` e `certificados-gerados/organizadores/`.

### Outros comandos Makefile

```bash
make help    # Lista todos os comandos disponíveis
make clean   # Remove os PDFs gerados
```

---

## GitHub Actions

### Disparo manual

1. Vá na aba **Actions** do repositório
2. Selecione **Gerar e Enviar Certificados**
3. Clique em **Run workflow**
4. Escolha o **modo** (`participantes`, `organizadores` ou `ambos`)
5. Escolha se deseja **enviar emails** (`true` / `false`)

### Disparo automático

O workflow é disparado automaticamente ao atualizar `data/participantes.csv` ou `data/organizadores.csv` na branch `main` (gera PDFs sem enviar emails).

### Configuração dos Secrets

Acesse **Settings → Secrets and variables → Actions** e adicione:

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Seu email | `seu@gmail.com` |
| `SMTP_PASS` | App Password | `abcd efgh ijkl mnop` |
| `SMTP_FROM` | *(opcional)* Email remetente | `noreply@gmail.com` |

> Use Gmail com [App Password](https://myaccount.google.com/apppasswords) (requer 2FA ativo).

---

## Tech Stack

| Ferramenta | Uso |
|------------|-----|
| [Puppeteer](https://pptr.dev) | Renderização HTML → PDF via Chromium headless |
| [pdf-lib](https://pdf-lib.js.org) | Empacotamento do PNG em PDF |
| [Nodemailer](https://nodemailer.com) | Envio de emails com anexo |
| [csv-parser](https://www.npmjs.com/package/csv-parser) | Leitura dos arquivos CSV |
| [GitHub Actions](https://github.com/features/actions) | Pipeline CI/CD de geração e envio |

---

<div align="center">
Feito com ☁️ pelo <strong>AWS Cloud Club Univali</strong>
</div>
