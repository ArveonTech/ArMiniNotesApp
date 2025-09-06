import readline from "readline/promises";

// ambil setiap output dari input terminal
const inputNotes = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export default inputNotes;
