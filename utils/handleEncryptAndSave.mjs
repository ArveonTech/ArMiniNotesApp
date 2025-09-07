// import module
import assert from "assert";
import crypto from "crypto";
import fsp from "fs/promises";
import perf from "perf_hooks";
import dotenv from "dotenv";
import process from "process";
import zlib from "zlib";
import path from "path";

// perlu modules untuk mengambil key dari file lain
dotenv.config();

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// ambil key dari file .env
const key = Buffer.from(process.env.SECRET_KEY, "hex");

// fungsi untuk enkripsi dan menyimpan enkripsi
const handleEncryptAndSave = async (ses) => {
  assert.ok(ses, "session tidak boleh kosong");

  const start = perf.performance.now();

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const cipherText = Buffer.concat([cipher.update(ses.buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encrypted = Buffer.concat([iv, cipherText, authTag]);

  const [errorWriteFile, _] = await to(fsp.writeFile(ses.filePath, encrypted));
  if (errorWriteFile) return console.log(`gagal menambah file : ${errorWriteFile}`);

  const [errorReadFile, dataReadFile] = await to(fsp.readFile(ses.filePath));
  if (errorReadFile) return console.log(`gagal membaca file : ${errorReadFile}`);

  const dataCompress = zlib.gzipSync(dataReadFile);
  console.log(ses.filePath);

  if (path.basename(ses.filePath).endsWith(".txt.gz")) {
    const [errorCompressFile, _] = await to(fsp.writeFile(`${ses.filePath}`, dataCompress));
    if (errorCompressFile) return console.log(`gagal compress file : ${errorCompressFile}`);
  } else {
    const [errorCompressFile, _] = await to(fsp.writeFile(`${ses.filePath}.gz`, dataCompress));
    if (errorCompressFile) return console.log(`gagal compress file : ${errorCompressFile}`);

    const [errorDelete, dataDelete] = await to(fsp.unlink(ses.filePath));
    if (errorDelete) return console.log(`gagal menghapus file : ${errorDelete}`);
  }

  const end = perf.performance.now();
  console.log(`Waktu proses encrypt: ${end - start} ms`);
};

export default handleEncryptAndSave;
