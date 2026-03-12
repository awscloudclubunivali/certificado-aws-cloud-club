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
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

module.exports = { lerCSV };
