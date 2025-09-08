// import module
import fsp from "fs/promises";
import path from "path";
import url from "url";

// ambil __filename dan __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi ambil list dalam direktori
const handleListNotes = async () => {
  const getDirList = path.join(__dirname, `..`, `notes`);

  let [errorListNotes, listNotes] = await to(fsp.readdir(getDirList));
  if (errorListNotes) return console.info(`terjadi error : ${errorListNotes}`);

  const list = listNotes.length > 0 ? listNotes : "tidak ada catatan";
  return list;
};

export default handleListNotes;
