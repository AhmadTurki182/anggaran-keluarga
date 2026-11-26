# Dompet Keluarga

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/AhmadTurki182/anggaran-keluarga/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/AhmadTurki182/anggaran-keluarga/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Dompet Keluarga** — situs anggaran rumah tangga berbahasa Indonesia untuk mengatur uang bulanan: ringkasan saldo dan pemasukan-pengeluaran, daftar transaksi yang bisa ditambah/diubah/dihapus, anggaran per kategori dengan penanda melebihi batas, dan laporan bulan ini vs bulan lalu. Semua angka dalam rupiah, dengan data contoh keluarga Indonesia bulan November 2026 (gaji Rp 8.500.000 + freelance Rp 1.200.000). Data pengguna tersimpan lokal di perangkat (localStorage); situs tidak mengirim apa pun ke internet.

Competition: [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457) — total hadiah $50, 10 besar berbagi. AI judge membandingkan situs dua-dua lewat screenshot dan outline source; makin sering dipilih, makin tinggi peringkat.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no network, plain static files.

## Screenshots

1. `1-dashboard.jpg` — ringkasan: saldo Rp 4.460.000, grafik pengeluaran per kategori, transaksi terbaru.
2. `2-transaksi.jpg` — halaman Transaksi dengan filter, pencarian, dan formulir tambah transaksi.
3. `3-anggaran.jpg` — halaman Anggaran: progress per kategori, Kesehatan melewati batas Rp 35.000.
4. `4-phone.jpg` — tampilan ponsel (layout menumpuk, tanpa overflow horizontal).

## How it works

- **Ringkasan:** KPI pemasukan, pengeluaran, sisa uang, dan persen anggaran terpakai; grafik batang per kategori; transaksi terbaru; sekilas anggaran.
- **Transaksi:** filter berdasarkan jenis, kategori, dan bulan, plus pencarian teks; formulir tambah/ubah dengan validasi (jumlah minimal Rp 1.000, keterangan wajib); hapus dengan konfirmasi; semua tersimpan di localStorage.
- **Anggaran:** batas bulanan per kategori (total Rp 6.150.000) dengan progress bar; kategori yang melebihi batas ditandai merah; batas bisa diubah lewat tombol "Ubah".
- **Laporan:** perbandingan November vs Oktober 2026 per kategori (pengeluaran turun Rp 865.000) dan pembagian pengeluaran (belanja harian 25%, pendidikan 20%, tabungan 19%).

## File layout

- `app/index.html` — struktur halaman dan empat seksi (hash routing).
- `app/style.css` — seluruh gaya, palet hijau/amber, layout ponsel.
- `app/data.js` — kategori, anggaran, transaksi contoh, dan ringkasan Oktober.
- `app/ui.js` — fungsi render: KPI, grafik batang, tabel, baris anggaran, laporan.
- `app/main.js` — state localStorage, routing, filter, dan formulir transaksi.
- `main.ts` — menyalin `app/` dan `screenshots/` ke output dan menulis `dossier.json`.
