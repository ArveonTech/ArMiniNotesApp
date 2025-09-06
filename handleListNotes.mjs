import fsp from "fs/promises";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// fungsi ambil list dalama direktori
const handleListNotes = async () => {
  const getDirList = path.join(__dirname, `notes`);

  let [errorListNotes, listNotes] = await to(fsp.readdir(getDirList));
  if (errorListNotes) return console.log(`terjadi error : ${errorListNotes}`);

  const list = listNotes.length > 0 ? listNotes : "tidak ada catatan";
  console.log(list);
};

export default handleListNotes;
