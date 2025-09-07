// import module
import path from "path";
import url from "url";

// import component
import inputNotes from "./inputInterface.mjs";

const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

// fungsi untuk membuat kondisi add = true
const handleAddNotes = async () => {
  console.info("--selesai : jika anda sudah selesai menambah catatan anda");
  console.info("--batal : jika anda batal menambah catatan anda");

  const nameNotesAdd = await inputNotes.question("beri nama catatan anda : ");
  const createFileAdd = `log-${nameNotesAdd}.txt`;
  const getDirAdd = path.join(__dirname, `..`, `notes`, createFileAdd);
  const session = {
    mode: "add",
    filePath: getDirAdd,
    buffer: "",
  };

  return session;
};

export default handleAddNotes;
