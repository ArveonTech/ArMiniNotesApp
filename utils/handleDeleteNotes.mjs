// import module
import fsp from "fs/promises";
import path from "path";
import url from "url";

// import component
import handleListNotes from "./handleListNotes.mjs";
import inputNotes from "./inputInterface.mjs";

const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi untuk menghapus catatan
const handleDeleteNotes = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.log(`terjadi error : ${errorListNotes}`);

  console.info(await dataListNotes);

  const [errorQuestion, nameNotesDel] = await to(inputNotes.question("catatan yang ingin dihapus : "));
  if (errorQuestion) return console.log(`terjadi error : ${errorQuestion}`);

  const createFileDel = `${nameNotesDel}`;
  const getDirDel = path.join(__dirname, `..`, `notes`, createFileDel);

  const [errorDelete, _] = await to(fsp.unlink(getDirDel));
  if (errorDelete) return console.log(`terjadi error : ${errorDelete}`);

  console.info(`file : ${path.basename(getDirDel)} berhasil dihapus`);
};

export default handleDeleteNotes;
