// import module yang diperlukan
import fsp from "fs/promises";
import os from "os";
import process from "process";
import url from "url";
import path from "path";
import events from "events";
import crypto from "crypto";
import dotenv from "dotenv";
import assert from "assert";
import perf from "perf_hooks";
import zlib from "zlib";
import stream from "stream";

// import component
import inputNotes from "./inputInterface.mjs";
import handleAddNotes from "./handleAddNotes.mjs";
import handleDeleteNotes from "./handleDeleteNotes.mjs";
import handleDaftarNotes from "./handleListNotes.mjs";

// perlu modules untuk mengambil key dari file lain
dotenv.config();

// ambil key dari file .env
const key = Buffer.from(process.env.SECRET_KEY, "hex");

// CommonJS: Node kasih __dirname & __filename otomatis.
// ESM: harus bikin sendiri → ambil import.meta.url → convert → baru jadi mirip yang CommonJS.
const __filename = url.fileURLToPath(import.meta.url); // ambil lokasi file yang lagi berjalan(format nya file://),lalu kita ubah ke absolute ./file/
const __dirname = path.dirname(__filename);
const log = new events.EventEmitter();

// untuk membuat object saat mode add atau delete
let session = null;

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// beri ala" commandline
console.info("Info :");
console.info(`--tambahCatatan : untuk menambah catatan anda`);
console.info(`--hapusCatatan : untuk menghapus catatan anda`);
console.info(`--editCatatan : untuk mengedit catatan anda`);
console.info(`--daftarCatatan : untuk menampilkan list catatan anda`);
console.info(`--lihatCatatan : untuk menampilkan catatan anda`);
console.info(`--keluar : untuk keluar aplikasi`);
console.info(`--spek : untuk spesifikasi device anda \n`);

// fungsi menambahkan input user ke session.buffer
const appendToBuffer = (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");
  ses.buffer = ses.buffer ? ses.buffer + "\n" + chunk : chunk;
};

// fungsi untuk enkripsi dan menyimpan enkripsi
const encryptAndSave = async (ses) => {
  assert.ok(ses, "session tidak boleh kosong");

  const start = perf.performance.now();
  console.log(ses.buffer);
  console.log(ses.buffer);
  console.log(ses.buffer);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const cipherText = Buffer.concat([cipher.update(ses.buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encrypted = Buffer.concat([iv, cipherText, authTag]);

  const [errorWriteFile, dataWriteFile] = await to(fsp.writeFile(ses.filePath, encrypted));
  if (errorWriteFile) return console.log(`gagal menambah file : ${errorWriteFile}`);

  const [errorReadFile, dataReadFile] = await to(fsp.readFile(ses.filePath));
  if (errorReadFile) return console.log(`gagal membaca file : ${errorReadFile}`);

  const dataCompress = zlib.gzipSync(dataReadFile);
  const [errorCompressFile, dataCompressFile] = await to(fsp.writeFile(`${ses.filePath}.gz`, dataCompress));
  if (errorCompressFile) return console.log(`gagal compress file : ${errorCompressFile}`);

  const [errorDelete, dataDelete] = await to(fsp.unlink(ses.filePath));
  if (errorDelete) return console.log(`gagal menghapus file : ${errorDelete}`);

  const end = perf.performance.now();
  console.log(`Waktu proses encrypt: ${end - start} ms`);
};

// fungsi untuk dekripsi dan mengembalikan dekripsi
const decrypt = async (file) => {
  assert.ok(file, "file yang ingin didekripsi harus ada");
  const readFile = await fsp.readFile(file);
  const fileDecompress = zlib.gunzipSync(readFile);

  return new Promise(async (resolve, reject) => {
    const start = perf.performance.now();
    const chunkStream = [];

    const streamData = stream.Readable.from(fileDecompress);

    streamData.on("data", (chunk) => chunkStream.push(chunk));

    streamData.on("end", () => {
      try {
        const buffer = Buffer.concat(chunkStream);
        const iv = buffer.slice(0, 16);
        const ciphertext = buffer.slice(16, buffer.length - 16);
        const authTag = buffer.slice(buffer.length - 16);
        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        const end = perf.performance.now();
        console.log(`Waktu proses decrypt: ${end - start} ms`);
        resolve(decrypted);
      } catch (err) {
        reject(err);
      }
    });

    streamData.on("error", reject);
  });
};

// fungsi saat masuk kondisi tambah
const addNotes = async (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");

  if (chunk.toString().toLowerCase() === "selesai") {
    const [errorAddNotes, dataAddNotes] = await to(encryptAndSave(ses));
    if (errorAddNotes) return console.log(`terjadi error : ${errorAddNotes}`);
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
    const [errorEditNotes, dataEditNotes] = await to(encryptAndSave(sessionCrypt));
    if (errorEditNotes) return console.log(`terjadi error : ${errorEditNotes}`);
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

// fungsi untuk membuat kondisi edit = true
const handleEditCatatan = async () => {
  const [errorListNotes, dataListNotes] = await to(handleListNotes());
  if (errorListNotes) return console.log(`terjadi error : ${errorListNotes}`);

  if (dataListNotes === "tidak ada catatan") {
    console.log("tidak ada catatan");
    return;
  }
  console.log(dataListNotes);

  console.info("--selesai : jika anda sudah selesai mengedit dengan catatan anda");
  console.info("--batal : jika anda batal mengedit catatan anda");

  const [errorNotesEdit, nameNotesEdit] = await to(inputNotes.question("cari nama file catatan anda : "));
  if (errorNotesEdit) return console.log(`terjadi error : ${errorNotesEdit}`);

  const getDirEdit = path.join(__dirname, `notes`, nameNotesEdit);
  try {
    await fsp.access(getDirEdit);
    session = {
      mode: "edit",
      filePath: getDirEdit,
      buffer: (await decrypt(getDirEdit)).toString("utf-8"),
    };
  } catch (e) {
    e.code === "ENOENT" ? console.info("File tidak dapat ditemukan") : console.info(e.message);
  }
};

// fungsi untuk melihat catatan
const handleLihatCatatan = async () => {
  const [errorListNotes, dataListNotes] = await to(handleDaftarNotes());
  if (errorListNotes) return console.log(`terjadi error : ${errorListNotes}`);
  if (dataListNotes === "tidak ada catatan") {
    console.log("tidak ada catatan");
    return;
  }
  console.log(dataListNotes);

  const [errorReadNotes, nameReadNotes] = await to(inputNotes.question("cari nama file catatan anda : "));
  if (errorReadNotes) return console.log(`terjadi error : ${errorReadNotes}`);

  const getFileRead = `${path.join(__dirname, "notes", nameReadNotes)}`;
  const [errorDecompress, fileDecompress] = await to(decrypt(getFileRead));
  if (errorDecompress) return console.log(`terjadi error : ${errorDecompress}`);

  console.log(fileDecompress.toString("utf-8"));
};

// fungsi untuk keluar dari aplikasi
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
  tambahcatatan: async () => {
    session = await handleAddNotes();
  },

  hapuscatatan: async () => {
    await handleDeleteNotes();
  },
  editcatatan: handleEditCatatan,
  lihatcatatan: handleLihatCatatan,
  daftarcatatan: handleDaftarNotes,
  keluar: handleKeluar,
  spek: handleSpek,
};

inputNotes.removeAllListeners("line");
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
