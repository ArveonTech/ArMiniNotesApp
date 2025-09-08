# 📝 Mini Notes App (Versi CLI)

Aplikasi catatan sederhana menggunakan **Node.js** hanya dengan module bawaan.

---

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

## 📂 Struktur Project

arMiniNotesApp/  
│── node_modules/ # dependency project  
│── notes/ # tempat simpan semua catatan terenkripsi  
|── utils/ # tempat fungsi semua fitur  
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
