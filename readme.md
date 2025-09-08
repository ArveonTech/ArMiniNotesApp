# 📝 Mini Notes App (Versi CLI)

Aplikasi catatan sederhana menggunakan **Node.js** hanya dengan module bawaan.

---

☁️ Bahasa Indonesia

## 🚀 Fitur

✍️ Tambah Catatan → bikin catatan baru, otomatis disimpan dalam file terenkripsi.  
🗑️ Hapus Catatan → hapus catatan yang dipilih dari direktori notes.  
📝 Edit Catatan → ubah isi catatan lama dengan enkripsi ulang.  
✏️ Rename Catatan → ubah nama file catatan lama menjadi nama baru tanpa kehilangan isinya.  
📖 Lihat Catatan → pilih file tertentu untuk baca isi catatan (setelah didekripsi).  
📂 Daftar Catatan → tampilkan semua catatan yang tersimpan.  
👤 Info Spek Device → lihat detail OS, CPU, RAM lewat module os.  
🔔 Logging Event → semua aksi dicatat dengan events.  
🔒 Enkripsi & Dekripsi → catatan aman karena diolah dengan AES-256-GCM.  
🗜️ Compress & Decompress → simpan catatan lebih ringkas pakai gzip, bisa diekstrak lagi kalau dibuka.

## 📦 Module Node.js yang Dipakai

- **fs** → buat, baca, hapus file catatan
- **os** → tampilkan info device user
- **readline** → interaksi CLI dengan user
- **path** → bikin path file yang cross-platform
- **events** → trigger event tiap aksi catatan
- **crypto** → enkripsi & dekripsi catatan rahasia
- **dotenv** → ambil secret key dari .env
- **assert** → validasi parameter agar function tidak jalan dengan nilai undi/null
- **perf_hooks** → cek performa waktu eksekusi (enkripsi, dekripsi, dll.)
- **zlib** → compress & decompress catatan dengan gzip
- **stream** → olah data file secara bertahap (pipeline read/write)

🌐 English Version

## 🚀 Features

✍️ Add Note → create a new note, automatically saved in an encrypted file.  
🗑️ Delete Note → remove the selected note from the notes directory.  
📝 Edit Note → modify an existing note with re-encryption.  
✏️ Rename Note → change a note’s file name without losing its content.  
📖 View Note → select a file to read its content (after decryption).  
📂 List Notes → display all saved notes.  
👤 Device Info → view OS, CPU, RAM details via the os module.  
🔔 Event Logging → track all actions using events.  
🔒 Encrypt & Decrypt → notes are secured with AES-256-GCM.  
🗜️ Compress & Decompress → save notes compactly with gzip, extractable when opened.

## 📦 Node.js Modules Used

fs → create, read, and delete note files  
os → display user device info  
readline → CLI interaction with the user  
path → generate cross-platform file paths  
events → trigger events for note actions  
crypto → encrypt & decrypt secret notes  
dotenv → load SECRET_KEY from .env  
assert → validate parameters to prevent functions from running with invalid/null values  
perf_hooks → check execution performance (encryption, decryption, etc.)  
zlib → compress & decompress notes using gzip  
stream → process file data in chunks (read/write pipeline)

## 📂 Project Structure

arMiniNotesApp/
│── node_modules/ # project dependencies  
│── notes/ # stores all encrypted notes  
│── utils/ # functions for all features  
│── .env # stores SECRET_KEY for crypto  
│── .gitignore # git ignored files  
│── app.mjs # main program (CLI app)  
│── package.json # project metadata & dependencies  
│── package-lock.json # npm lock file  
│── readme.md # project documentation  
│── remind.txt # learning notes

---

## ⚙️ How to Run

1. Clone the repo or download this project
   ```bash
   git clone https://github.com/ArveonTech/ArMiniNotesApp.git
   cd ArMiniNotesApp
   ```

2. node app.js
