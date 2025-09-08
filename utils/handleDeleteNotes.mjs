// import module
import fsp from "fs/promises";
import path from "path";
import url from "url";

// import component
import handleListNotes from "./handleListNotes.mjs";
import inputNotes from "./inputInterface.mjs";

// ambil __filename dan __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi untuk menghapus catatan
const handleDeleteNotes = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.info(`terjadi error : ${errorListNotes}`);

  console.info(await dataListNotes);

  const [errorQuestion, nameNotesDel] = await to(inputNotes.question("catatan yang ingin dihapus : "));
  if (errorQuestion) return console.info(`terjadi error : ${errorQuestion}`);

  const createFileDel = `${nameNotesDel}`;
  const getDirDel = path.join(__dirname, `..`, `notes`, createFileDel);

  const [errorDelete, _] = await to(fsp.unlink(getDirDel));
  if (errorDelete) return console.info(`terjadi error : ${errorDelete}`);

  console.info(`file : ${path.basename(getDirDel)} berhasil dihapus`);
};

export default handleDeleteNotes;
