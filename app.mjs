// import module yang diperlukan
import fs from "fs/promises";
import os from "os";
import process from "process";
import readline from "readline/promises";
import url from "url";
import path from "path";
import events from "events";
import crypto from "crypto";
import dotenv from "dotenv";
import assert from "assert";
import perf from "perf_hooks";

// perlu modules untuk mengambil key dari file lain
dotenv.config();

// ambil key dari file .env
const key = Buffer.from(process.env.SECRET_KEY, "hex");

// CommonJS: Node kasih __dirname & __filename otomatis.
// ESM: harus bikin sendiri → ambil import.meta.url → convert → baru jadi mirip yang CommonJS.
const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);
const log = new events.EventEmitter();

// buat kondisi jika edit, add
// kumpulkan semua catatan yg di input user
// ambil file yang telah diassign
let session = null;

// beri ala" commandline
console.info("Info :");
console.info(`--tambahCatatan : untuk menambah catatan anda`);
console.info(`--hapusCatatan : untuk menghapus catatan anda`);
console.info(`--editCatatan : untuk mengedit catatan anda`);
console.info(`--daftarCatatan : untuk menampilkan list catatan anda`);
console.info(`--lihatCatatan : untuk menampilkan catatan anda`);
console.info(`--keluar : untuk keluar aplikasi`);
console.info(`--spek : untuk spesifikasi device anda \n`);

// ambil setiap output dari input terminal
const inputNotes = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// fungsi menambahkan input user ke session.buffer
const appendToBuffer = (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");
  ses.buffer = ses.buffer ? ses.buffer + "\n" + chunk : chunk;
};

// fungsi untuk enkripsi dan menyimpan enkripsi
const encryptAndSave = async (ses) => {
  assert.ok(ses, "session tidak boleh kosong");
  const start = perf.performance.now();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const cipherText = Buffer.concat([cipher.update(ses.buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encrypted = Buffer.concat([iv, cipherText, authTag]);
  await fs.writeFile(ses.filePath, encrypted);
  const end = perf.performance.now();
  console.log(`Waktu proses encrypt: ${end - start} ms`);
};

// fungsi untuk dekripsi dan mengembalikan dekripsi
const decrypt = async (file) => {
  assert.ok(file, "file yang ingin didekripsi harus ada");
  const start = perf.performance.now();
  const dataFile = await fs.readFile(file);
  const iv = dataFile.slice(0, 16);
  const ciphertext = dataFile.slice(16, dataFile.length - 16);
  const authTag = dataFile.slice(dataFile.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = decipher.update(ciphertext) + decipher.final();
  console.log(`Waktu proses decrypt: ${end - start} ms`);
  return decrypted;
};

// fungsi ambil list dalama direktori
const getListNotes = async () => {
  const getDirList = path.join(__dirname, `notes`);
  let listNotes = await fs.readdir(getDirList);
  return listNotes.length > 0 ? listNotes : "tidak ada catatan";
};

// fungsi saat masuk kondisi tambah
const addNotes = async (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");
  if (chunk.toString().toLowerCase() === "selesai") {
    await encryptAndSave(ses);
    console.info(`file : ${path.basename(ses.filePath)} berhasil ditambahkan`);
    session = null;
  } else if (chunk.toString().toLowerCase() === "batal") {
    console.log(`anda batal menambah catatan ${ses.filePath}`);
    session = null;
    return;
  } else {
    appendToBuffer(ses, chunk);
  }
};

// fungsi saat masuk kondisi edit
const editNotes = async (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");
  if (chunk.toString().toLowerCase() === "selesai") {
    const sessionCrypt = {
      filePath: ses.filePath,
      buffer: ses.buffer,
    };
    await encryptAndSave(sessionCrypt);
    console.info(`file : ${path.basename(ses.filePath)} berhasil diedit`);
    session = null;
  } else if (chunk.toString().toLowerCase() === "batal") {
    console.log(`anda batal mengedit catatan ${ses.filePath}`);
    session = null;
    return;
  } else {
    appendToBuffer(ses, chunk);
  }
};

// fungsi ambil spec device
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

// buat events dari module
log.on("note", (status, chunk, session) => {
  switch (status) {
    case "add":
      addNotes(session, chunk);
      break;
    case "edit":
      editNotes(session, chunk);
      break;
    case "delete":
      deleteNotes();
      break;
    default:
      console.info(`tidak ada status`);
  }
});

// fungsi untuk membuat kondisi add = true
const handleTambahCatatan = async () => {
  console.info("--selesai : jika anda sudah selesai menambah catatan anda");
  console.info("--batal : jika anda batal menambah catatan anda");
  const nameNotesAdd = await inputNotes.question("beri nama catatan anda : ");
  const createFileAdd = `log-${nameNotesAdd}.txt`;
  const getDirAdd = path.join(__dirname, `notes`, createFileAdd);
  session = {
    mode: "add",
    filePath: getDirAdd,
    buffer: "",
  };
};

// fungsi untuk menghapus catatan
const handleHapusCatatan = async () => {
  console.info(await getListNotes());
  const nameNotesDel = await inputNotes.question("catatan yang ingin dihapus : ");
  const createFileDel = `${nameNotesDel}`;
  const getDirDel = path.join(__dirname, `notes`, createFileDel);
  try {
    await fs.unlink(getDirDel);
    console.info(`file : ${path.basename(getDirDel)} berhasil dihapus`);
  } catch (e) {
    console.info(e.message);
  }
};

// fungsi untuk membuat kondisi edit = true
const handleEditCatatan = async () => {
  const getStatusListEdit = await getListNotes();
  if (getStatusListEdit === "tidak ada catatan") {
    console.log("tidak ada catatan");
    return;
  }
  console.log(getStatusListEdit);
  console.info("--selesai : jika anda sudah selesai mengedit dengan catatan anda");
  console.info("--batal : jika anda batal mengedit catatan anda");
  const nameNotesEdit = await inputNotes.question("cari nama file catatan anda : ");
  const createFileEdit = `${nameNotesEdit}`;
  const getDirEdit = path.join(__dirname, `notes`, createFileEdit);
  try {
    await fs.access(getDirEdit);
    session = {
      mode: "edit",
      filePath: getDirEdit,
      buffer: await decrypt(getDirEdit),
    };
  } catch (e) {
    e.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(e.message);
  }
};

// fungsi untuk melihat catatan
const handleLihatCatatan = async () => {
  const getStatusListRead = await getListNotes();
  if (getStatusListRead === "tidak ada catatan") {
    console.log("tidak ada catatan");
    return;
  }
  console.log(getStatusListRead);
  const nameReadNotes = await inputNotes.question("cari nama file catatan anda : ");
  const getFileRead = `${path.join(__dirname, "notes", nameReadNotes)}`;
  console.log(await decrypt(getFileRead));
};

// fungsi untuk melihat daftar catatan
const handleDaftarCatatan = async () => {
  console.info(await getListNotes());
};

// fugsi untuk keluar dari aplikasi
const handleKeluar = () => {
  inputNotes.close();
  console.log("Anda telah keluar");
};

// fungsi untuk memberikan informasi device pengguna
const handleSpek = () => {
  console.info(specification());
};

// membuat list perintah dan action nya
const commands = {
  tambahcatatan: handleTambahCatatan,
  hapuscatatan: handleHapusCatatan,
  editcatatan: handleEditCatatan,
  lihatcatatan: handleLihatCatatan,
  daftarcatatan: handleDaftarCatatan,
  keluar: handleKeluar,
  spek: handleSpek,
};

// tangkap data setiap input dan tambahkan event handler
inputNotes.addListener("line", async (data) => {
  if (session?.mode === "add") {
    log.emit("note", "add", data, session);
  } else if (session?.mode === "edit") {
    log.emit("note", "edit", data, session);
  } else {
    const cmd = data.toString().toLowerCase();
    if (commands[cmd]) {
      await commands[cmd]();
    } else {
      console.info("Perintah tidak ditemukan");
    }
  }
});
