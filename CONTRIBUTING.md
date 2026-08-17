# Contribuindo

Obrigado por considerar contribuir com este projeto! 🎉

## Como contribuir

1. Faça um fork do repositório e crie uma branch a partir da `main`:
   `git checkout -b minha-feature`
2. Instale as dependências: `npm install`
3. Copie os arquivos de configuração de exemplo:
   ```bash
   cp .env.example .env
   cp data/participantes.example.csv data/participantes.csv
   cp data/organizadores.example.csv data/organizadores.csv
   ```
4. Faça suas alterações e teste localmente com `make participantes` ou `make organizadores`.
5. Garanta que nenhum dado pessoal real (CSV de participantes, credenciais SMTP) seja incluído no commit.
6. Abra um Pull Request descrevendo o que foi alterado e por quê.

## Reportando bugs ou sugerindo melhorias

Abra uma [issue](../../issues) descrevendo o problema ou a sugestão, com o máximo de contexto possível (passos para reproduzir, comportamento esperado vs. atual).

## Segurança e dados pessoais

Este projeto lida com nomes e emails de participantes de eventos. **Nunca** commite:
- Arquivos `data/participantes.csv` ou `data/organizadores.csv` com dados reais (já estão no `.gitignore`).
- Credenciais SMTP ou qualquer segredo — use variáveis de ambiente (`.env`, nunca commitado).

Se encontrar dados sensíveis expostos no repositório, por favor reporte de forma privada em vez de abrir uma issue pública.

## Código de conduta

Ao participar, você concorda em seguir o [Código de Conduta](CODE_OF_CONDUCT.md) do projeto.
