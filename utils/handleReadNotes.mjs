// import module
import path from "path";
import url from "url";
import fsp from "fs/promises";

// import component
import handleListNotes from "./handleListNotes.mjs";
import inputNotes from "./inputInterface.mjs";
import handleDecrypt from "./handleDecrypt.mjs";

// CommonJS: Node kasih __dirname & __filename otomatis.
// ESM: harus bikin sendiri → ambil import.meta.url → convert → baru jadi mirip yang CommonJS.
const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi untuk melihat catatan
const handleReadNotes = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.log(`terjadi error : ${errorListNotes}`);

  console.log(dataListNotes);

  const [errorReadNotes, nameReadNotes] = await to(inputNotes.question("cari nama file catatan anda : "));
  if (errorReadNotes) return console.log(`terjadi error : ${errorReadNotes}`);

  const getFileRead = `${path.join(__dirname, `..`, "notes", nameReadNotes)}`;
  try {
    await fsp.access(getFileRead);
    const [errorDecompress, fileDecompress] = await to(handleDecrypt(getFileRead));
    if (errorDecompress) return console.log(`terjadi error : ${errorDecompress}`);

    console.log(fileDecompress.toString("utf-8"));
  } catch (e) {
    e.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(e.message);
  }
};

export default handleReadNotes;
