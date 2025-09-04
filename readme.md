# 📝 Mini Notes App (Versi CLI)

Aplikasi catatan sederhana menggunakan **Node.js** hanya dengan module bawaan.

---

## 🚀 Fitur

✍️ Tambah Catatan → bikin catatan baru, otomatis disimpan dalam file terenkripsi.
📖 Lihat Catatan → pilih file tertentu untuk baca isi catatan (setelah didekripsi).
📝 Edit Catatan → ubah isi catatan lama dengan enkripsi ulang.
🗑️ Hapus Catatan → hapus catatan yang dipilih dari direktori notes.
📂 Daftar Catatan → tampilkan semua catatan yang tersimpan.
👤 Info Spek Device → lihat detail OS, CPU, RAM lewat module os.
🔔 Logging Event → semua aksi dicatat dengan events.
🔒 Enkripsi & Dekripsi → catatan aman karena diolah dengan AES-256-GCM.

---

## 📦 Module Node.js yang Dipakai

fs → buat, baca, hapus file catatan
os → tampilkan info device user
readline → interaksi CLI dengan user
path → bikin path file yang cross-platform
events → trigger event tiap aksi catatan
crypto → enkripsi & dekripsi catatan rahasia
dotenv → ambil secret key dari .env

---

## 📂 Struktur Project

arMiniNotesApp/
│── node_modules/ # dependency project
│── notes/ # tempat simpan semua catatan terenkripsi
│── .env # simpan SECRET_KEY untuk crypto
│── .gitignore # file yang diabaikan git
│── app.mjs # main program (CLI app)
│── package.json # metadata & dependency project
│── package-lock.json # lock file npm
│── readme.md # dokumentasi project
│── remind.txt # catatan pembelajaran

---

## ⚙️ Cara Menjalankan

1. Clone repo atau download project ini
   ```bash
   git clone https://github.com/ArveonTech/ArMiniNotesApp.git
   cd ArMiniNotesApp
   ```

node app.js
