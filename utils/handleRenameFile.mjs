// import module
import path from "path";
import url from "url";
import fsp from "fs/promises";

// import component
import inputNotes from "./inputInterface.mjs";
import handleDecrypt from "./handleDecrypt.mjs";
import handleListNotes from "./handleListNotes.mjs";

// CommonJS: Node kasih __dirname & __filename otomatis.
// ESM: harus bikin sendiri → ambil import.meta.url → convert → baru jadi mirip yang CommonJS.
const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

const getDir = (file) => {
  const pathDir = path.join(__dirname, `..`, `notes`, file);
  return pathDir;
};

const handleRenameFile = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.info(`terjadi error : ${errorListNotes}`);

  console.info(dataListNotes);

  const getFileNameOld = await inputNotes.question("Masukkan nama file yang ingin anda ubah : ");
  const getDirNameOld = getDir(getFileNameOld);
  try {
    const [errorAccess, _] = await to(fsp.access(getDirNameOld));
    if (errorAccess) return console.info("File lama tidak ditemukan");

    const getFileNameNew = await inputNotes.question("Masukkan nama file baru yang ingin anda ubah : ");
    const getDirNameNew = getDir(getFileNameNew);

    const [errorDirNameNew, fileAccessNew] = await to(fsp.access(`${getDirNameNew}.txt.gz`));

    if (!errorDirNameNew) return console.info("Nama file tidak boleh sama");

    const getDirFile = getDir(getFileNameNew + ".txt.gz");
    await to(fsp.rename(getDirNameOld, getDirFile));

    console.info("Nama file berhasil diganti");
  } catch (error) {
    error.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(error.message);
  }
};

export default handleRenameFile;
