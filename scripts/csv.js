const fs = require("fs");
const csv = require("csv-parser");

/**
 * Lê um arquivo CSV e retorna um array de objetos.
 * @param {string} csvPath - Caminho absoluto para o arquivo CSV.
 * @returns {Promise<object[]>}
 */
function lerCSV(csvPath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    // .pipe() não propaga o evento "error" da stream de origem para a de destino —
    // por isso o erro (ex.: arquivo inexistente) precisa ser escutado no readStream também.
    fs.createReadStream(csvPath)
      .on("error", reject)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

module.exports = { lerCSV };
