import fs from "fs/promises";
import os from "os";
import process from "process";
import readline from "readline/promises";
import { fileURLToPath } from "url";
import path from "path";
import events from "events";

// CommonJS: Node kasih __dirname & __filename otomatis.
// ESM: harus bikin sendiri → ambil import.meta.url → convert → baru jadi mirip yang CommonJS.

const __filename = fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);
const log = new events.EventEmitter();

console.info("Info :");
console.info(`--tambahCatatan : untuk menambah catatan anda`);
console.info(`--hapusCatatan : untuk menghapus catatan anda`);
console.info(`--editCatatan : untuk mengedit catatan anda`);
console.info(`--daftar : untuk menampilkan list catatan anda`);
console.info(`--spek : untuk spesifikasi device anda \n`);

let edit = false;
let add = false;
let dataAddNotes = "";
let getFile = null;

log.on("note", (file, status) => {
  switch (status) {
    case "add":
      console.info(`file : ${path.basename(file)} berhasil ditambahkan`);
      break;
    case "edit":
      console.info(`file : ${path.basename(file)} berhasil diedit`);
      break;
    case "delete":
      console.info(`file : ${path.basename(file)} berhasil dihapus`);
      break;
    default:
      console.info(`tidak ada status`);
  }
});

const inputNotes = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getListNotes = async () => {
  const getDirList = path.join(__dirname, `notes`);
  let listNotes = await fs.readdir(getDirList);
  return listNotes.length > 0 ? listNotes : "tidak ada catatan";
};

const specification = () => {
  const systemSpecs = {
    osType: os.type(),
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
  };

  return systemSpecs;
};

const addNotes = async (chunk) => {
  if (chunk.toString().toLowerCase() === "selesai") {
    log.emit("note", getFile, "add");
    await fs.writeFile(getFile, dataAddNotes);
    add = false;
    getFile = null;
    dataAddNotes = "";
  } else {
    dataAddNotes += chunk.toString() + "\n";
  }
};

const editNotes = async (chunk) => {
  if (chunk.toString().toLowerCase() === "selesai") {
    log.emit("note", getFile, "edit");
    await fs.appendFile(getFile, dataAddNotes);
    edit = false;
    getFile = null;
    dataAddNotes = "";
  } else {
    dataAddNotes += chunk.toString() + "\n";
  }
};

const deleteNotes = async () => {
  console.info(await getListNotes());
  const nameNotesDel = await inputNotes.question("catatan yang ingin dihapus :");
  const createFileDel = `${nameNotesDel}`;
  const getDirDel = path.join(__dirname, `notes`, createFileDel);
  try {
    await fs.unlink(getDirDel);
    log.emit("note", getDirDel, "delete");
  } catch (e) {
    console.info(e.message);
  }
};

inputNotes.addListener("line", async (data) => {
  if (add) {
    addNotes(data);
  } else if (edit) {
    editNotes(data);
  } else {
    switch (data.toString().toLowerCase()) {
      case "tambahcatatan":
        const nameNotesAdd = await inputNotes.question("beri nama catatan anda :");
        const createFileAdd = `log-${nameNotesAdd}.txt`;
        getFile = path.join(__dirname, `notes`, createFileAdd);
        add = true;
        break;
      case "hapuscatatan":
        deleteNotes();
        break;
      case "editcatatan":
        console.info(await getListNotes());
        console.info("--selesai : jika anda sudah selesai mengedit dengan catatan anda");
        const nameNotesEdit = await inputNotes.question("cari nama file catatan anda :");
        const createFileEdit = `${nameNotesEdit}`;
        const getDirEdit = path.join(__dirname, `notes`, createFileEdit);
        try {
          await fs.access(getDirEdit);
          getFile = getDirEdit;
          edit = true;
        } catch (e) {
          e.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(e.message);
        }
        break;
      case "daftar":
        console.info(await getListNotes());
        break;
      case "spek":
        console.info(specification());
        break;
      default:
        console.info("Perintah anda tidak dapat ditemukan");
    }
  }
});
