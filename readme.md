# 📝 Mini Notes App (Versi CLI)

Aplikasi catatan sederhana menggunakan **Node.js** hanya dengan module bawaan.

---

## 🚀 Fitur

- ✍️ Tambah catatan lalu simpan ke file
- 📖 Lihat semua catatan yang sudah disimpan
- 🗑️ Hapus catatan tertentu
- 👤 Tampilkan info user
- 🔔 Logging otomatis dengan **events**
- 🔒 Catatan rahasia dengan **crypto** (enkripsi & dekripsi)

---

## 📦 Module Node.js yang Dipakai

- **fs** → untuk operasi file (buat, baca, hapus catatan)
- **os** → untuk menampilkan info user
- **readline** → untuk interaksi input/output di terminal
- **path** → untuk path file yang aman & cross-platform
- **events** → untuk trigger log setiap ada aksi (tambah/hapus/edit)
- **crypto** → untuk enkripsi & dekripsi catatan rahasia

---

## 📂 Struktur Project

mini-notes/
│
├── notes/ # folder penyimpanan catatan
├── app.js # file utama aplikasi
└── README.md # dokumentasi project

---

## ⚙️ Cara Menjalankan

1. Clone repo atau download project ini
   ```bash
   git clone https://github.com/username/mini-notes.git
   cd mini-notes
   ```

node app.js
