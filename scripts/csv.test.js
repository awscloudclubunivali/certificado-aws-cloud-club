const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { lerCSV } = require("./csv");

function criarCSVTemporario(conteudo) {
  const filePath = path.join(os.tmpdir(), `csv-test-${Date.now()}-${Math.random().toString(36).slice(2)}.csv`);
  fs.writeFileSync(filePath, conteudo, "utf-8");
  return filePath;
}

test("lerCSV lê linhas e colunas corretamente", async () => {
  const filePath = criarCSVTemporario(
    "NOME_PARTICIPANTE,Email\nMaria da Silva,maria@example.com\nJoão Pereira,joao@example.com\n"
  );
  try {
    const rows = await lerCSV(filePath);
    assert.equal(rows.length, 2);
    assert.deepEqual(rows[0], { NOME_PARTICIPANTE: "Maria da Silva", Email: "maria@example.com" });
    assert.deepEqual(rows[1], { NOME_PARTICIPANTE: "João Pereira", Email: "joao@example.com" });
  } finally {
    fs.unlinkSync(filePath);
  }
});

test("lerCSV retorna array vazio para CSV só com cabeçalho", async () => {
  const filePath = criarCSVTemporario("NOME_PARTICIPANTE,Email\n");
  try {
    const rows = await lerCSV(filePath);
    assert.deepEqual(rows, []);
  } finally {
    fs.unlinkSync(filePath);
  }
});

test("lerCSV rejeita quando o arquivo não existe", async () => {
  await assert.rejects(() => lerCSV(path.join(os.tmpdir(), "nao-existe.csv")));
});
