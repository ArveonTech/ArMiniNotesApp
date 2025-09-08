// import module
import assert from "assert";
import fsp from "fs/promises";
import zlib from "zlib";
import perf from "perf_hooks";
import stream from "stream";
import dotenv from "dotenv";
import process from "process";
import crypto from "crypto";

// perlu modules untuk mengambil key dari file lain dan diconfigurasi kan
dotenv.config();

// buat function try and catch
const to = (promise) => promise.then((res) => [null, res]).catch((error) => [error, null]);

// ambil key dari file .env
const key = Buffer.from(process.env.SECRET_KEY, "hex");

// fungsi untuk dekripsi dan mengembalikan dekripsi
const handleDecrypt = async (file) => {
  assert.ok(file, "file yang ingin didekripsi harus ada");
  const [errorReadFile, readFile] = await to(fsp.readFile(file));
  if (errorReadFile) return console.info(`gagal membaca file : ${errorReadFile}`);
  
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
        console.info(`Waktu proses decrypt: ${end - start} ms`);
        resolve(decrypted);
      } catch (err) {
        reject(err);
      }
    });

    streamData.on("error", reject);
  });
};

export default handleDecrypt;
