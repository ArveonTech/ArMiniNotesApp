// import module
import path from "path";
import url from "url";
import fsp from "fs/promises";

// import component
import inputNotes from "./inputInterface.mjs";

const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi untuk membuat kondisi add = true
const handleAddNotes = async () => {
  console.info("--selesai : jika anda sudah selesai menambah catatan anda");
  console.info("--batal : jika anda batal menambah catatan anda");

  const nameNotesAdd = await inputNotes.question("beri nama catatan anda : ");
  const getDirAdd = path.join(__dirname, `..`, `notes`, `${nameNotesAdd}.txt`);

  const [err, res] = await to(fsp.access(`${getDirAdd}.gz`));
  if (!err) {
    console.info("Nama file tidak boleh sama");
    return;
  } else {
    const session = {
      mode: "add",
      filePath: getDirAdd,
      buffer: "",
    };
    return session;
  }
};

export default handleAddNotes;
