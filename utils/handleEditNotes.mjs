// import module
import url from "url";
import path from "path";
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

// fungsi untuk membuat kondisi edit = true
const handleEditNotes = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.info(`terjadi error : ${errorListNotes}`);

  console.info(dataListNotes);

  console.info("--selesai : jika anda sudah selesai mengedit dengan catatan anda");
  console.info("--batal : jika anda batal mengedit catatan anda");

  const [errorNotesEdit, nameNotesEdit] = await to(inputNotes.question("cari nama file catatan anda : "));
  if (errorNotesEdit) return console.info(`terjadi error : ${errorNotesEdit}`);

  const getDirEdit = path.join(__dirname, `..`, `notes`, nameNotesEdit);
  try {
    await fsp.access(getDirEdit);
    const session = {
      mode: "edit",
      filePath: getDirEdit,
      buffer: (await handleDecrypt(getDirEdit)).toString("utf-8"),
    };
    return session;
  } catch (error) {
    error.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(error.message);
  }
};

export default handleEditNotes;
