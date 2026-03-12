.PHONY: install participantes organizadores all clean help

# Carrega o .env se existir (não falha se não existir)
-include .env
export

# ─────────────────────────────────────────────────────────────────────────────

help: ## Exibe esta mensagem de ajuda
	@grep -Eh '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instala as dependências Node.js
	npm install

participantes: ## Gera certificados para participantes (data/participantes.csv)
	MODE=participante node scripts/index.js

organizadores: ## Gera certificados para organizadores (data/organizadores.csv)
	MODE=organizador node scripts/index.js

all: participantes organizadores ## Gera certificados para participantes e organizadores

clean: ## Remove os PDFs gerados
	rm -rf certificados-gerados/participantes certificados-gerados/organizadores
