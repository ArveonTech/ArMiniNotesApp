// import module yang diperlukan
import path from "path";
import events from "events";
import assert from "assert";

// import component
import inputNotes from "./utils/inputInterface.mjs";
import handleAddNotes from "./utils/handleAddNotes.mjs";
import handleDeleteNotes from "./utils/handleDeleteNotes.mjs";
import handleListNotes from "./utils/handleListNotes.mjs";
import handleEncryptAndSave from "./utils/handleEncryptAndSave.mjs";
import handleReadNotes from "./utils/handleReadNotes.mjs";
import handleEditNotes from "./utils/handleEditNotes.mjs";
import handleClose from "./utils/handleClose.mjs";
import handleSpek from "./utils/handleSpek.mjs";
import handleRenameFile from "./utils/handleRenameFile.mjs";

// buat event custom
const log = new events.EventEmitter();

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// untuk membuat object saat mode add atau delete
let session = null;

// beri ala" commandline
console.info("Info :");
console.info(`--tambahCatatan : untuk menambah catatan anda`);
console.info(`--hapusCatatan : untuk menghapus catatan anda`);
console.info(`--editCatatan : untuk mengedit catatan anda`);
console.info(`--ubahNamaCatatan : untuk mengganti nama catatan anda`);
console.info(`--lihatCatatan : untuk menampilkan catatan anda`);
console.info(`--daftarCatatan : untuk menampilkan list catatan anda`);
console.info(`--spek : untuk spesifikasi device anda`);
console.info(`--keluar : untuk keluar aplikasi \n`);

// fungsi menambahkan input user ke session.buffer
const appendToBuffer = (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");
  ses.buffer = ses.buffer ? ses.buffer + "\n" + chunk : chunk;
};

// fungsi saat masuk kondisi tambah
const addNotes = async (ses, chunk) => {
  assert.ok(ses, "session tidak boleh kosong");

  if (chunk.toString().toLowerCase() === "selesai") {
    const [errorAddNotes, dataAddNotes] = await to(handleEncryptAndSave(ses));
    if (errorAddNotes) return console.info(`terjadi error : ${errorAddNotes}`);
    console.info(`file : ${path.basename(ses.filePath)} berhasil ditambahkan`);
    session = null;
  } else if (chunk.toString().toLowerCase() === "batal") {
    console.info(`anda batal menambah catatan ${ses.filePath}`);
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
    const [errorEditNotes, dataEditNotes] = await to(handleEncryptAndSave(sessionCrypt));
    if (errorEditNotes) return console.info(`terjadi error : ${errorEditNotes}`);
    console.info(`file : ${path.basename(ses.filePath)} berhasil diedit`);
    session = null;
  } else if (chunk.toString().toLowerCase() === "batal") {
    console.info(`anda batal mengedit catatan ${ses.filePath}`);
    session = null;
    return;
  } else {
    appendToBuffer(ses, chunk);
  }
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

// membuat list perintah dan action nya
const commands = {
  tambahcatatan: async () => {
    session = await handleAddNotes();
  },

  hapuscatatan: async () => {
    await handleDeleteNotes();
  },
  editcatatan: async () => {
    session = await handleEditNotes();
  },
  lihatcatatan: handleReadNotes,
  daftarcatatan: async () => {
    const [errorListNotes, dataListNotes] = await to(handleListNotes());
    if (errorListNotes) return console.info(`terjadi error : ${errorListNotes}`);

    console.info(dataListNotes);
  },
  ubahNamaCatatan: handleRenameFile,
  spek: handleSpek,
  keluar: handleClose,
};

inputNotes.removeAllListeners("line");
// tangkap data setiap input dan tambahkan event handler
inputNotes.addListener("line", async (data) => {
  const cmd = data.toString().toLowerCase();
  if (session?.mode === "add") {
    log.emit("note", "add", data, session);
  } else if (session?.mode === "edit") {
    log.emit("note", "edit", data, session);
  } else {
    if (commands[cmd]) {
      await commands[cmd]();
    } else {
      console.info("Perintah tidak ditemukan");
    }
  }
});
