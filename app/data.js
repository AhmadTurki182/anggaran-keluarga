// Dompet Keluarga — data awal: kategori, anggaran, dan transaksi contoh
// keluarga Ahmad & Intan, November 2026 (angka realistis dalam rupiah).
// Pengguna bisa menambah/mengubah/menghapus transaksi; perubahan tersimpan
// di localStorage dan tidak mengubah data awal di file ini.

export const CATEGORIES = [
  { id: 'gaji', label: 'Gaji', kind: 'masuk' },
  { id: 'belanja', label: 'Belanja Harian', kind: 'keluar' },
  { id: 'listrik', label: 'Listrik & Air', kind: 'keluar' },
  { id: 'transport', label: 'Transport', kind: 'keluar' },
  { id: 'makan', label: 'Makan', kind: 'keluar' },
  { id: 'pendidikan', label: 'Pendidikan', kind: 'keluar' },
  { id: 'kesehatan', label: 'Kesehatan', kind: 'keluar' },
  { id: 'hiburan', label: 'Hiburan', kind: 'keluar' },
  { id: 'tabungan', label: 'Tabungan', kind: 'keluar' },
];

export const categoryLabel = (id) => {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
};

// Anggaran bulanan per kategori (November 2026).
export const BUDGETS = {
  belanja: 1500000,
  listrik: 350000,
  transport: 500000,
  makan: 900000,
  pendidikan: 1200000,
  kesehatan: 400000,
  hiburan: 300000,
  tabungan: 1000000,
};

export const totalBudget = () => Object.values(BUDGETS).reduce((a, b) => a + b, 0);

// Transaksi awal November 2026. id stabil agar edit/hapus bekerja.
export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-03', note: 'Gaji bulanan Ahmad', category: 'gaji', kind: 'masuk', amount: 8500000 },
  { id: 't02', date: '2026-11-01', note: 'Belanja sayur & lauk pasar pagi', category: 'belanja', kind: 'keluar', amount: 185000 },
  { id: 't03', date: '2026-11-02', note: 'Token listrik 200 ribu', category: 'listrik', kind: 'keluar', amount: 200000 },
  { id: 't04', date: '2026-11-02', note: 'Bensin motor (Pertalite)', category: 'transport', kind: 'keluar', amount: 150000 },
  { id: 't05', date: '2026-11-04', note: 'SPP anak bulan November', category: 'pendidikan', kind: 'keluar', amount: 650000 },
  { id: 't06', date: '2026-11-05', note: 'Iuran BPJS Kesehatan keluarga', category: 'kesehatan', kind: 'keluar', amount: 150000 },
  { id: 't07', date: '2026-11-06', note: 'Belanja mingguan supermarket', category: 'belanja', kind: 'keluar', amount: 320000 },
  { id: 't08', date: '2026-11-07', note: 'Makan siang keluarga di warteg', category: 'makan', kind: 'keluar', amount: 85000 },
  { id: 't09', date: '2026-11-08', note: 'Les matematika anak', category: 'pendidikan', kind: 'keluar', amount: 300000 },
  { id: 't10', date: '2026-11-09', note: 'Tagihan air PDAM', category: 'listrik', kind: 'keluar', amount: 85000 },
  { id: 't11', date: '2026-11-10', note: 'Bensin mobil + tol', category: 'transport', kind: 'keluar', amount: 195000 },
  { id: 't12', date: '2026-11-11', note: 'Belanja pasar: ayam, telur, buah', category: 'belanja', kind: 'keluar', amount: 210000 },
  { id: 't13', date: '2026-11-12', note: 'Obat flu & vitamin anak', category: 'kesehatan', kind: 'keluar', amount: 85000 },
  { id: 't14', date: '2026-11-13', note: 'Makan malam resto keluarga', category: 'makan', kind: 'keluar', amount: 250000 },
  { id: 't15', date: '2026-11-14', note: 'Upah freelance desain Intan', category: 'gaji', kind: 'masuk', amount: 1200000 },
  { id: 't16', date: '2026-11-15', note: 'Transfer ke tabungan', category: 'tabungan', kind: 'keluar', amount: 1000000 },
  { id: 't17', date: '2026-11-16', note: 'Belanja bulanan: beras 10 kg & minyak', category: 'belanja', kind: 'keluar', amount: 275000 },
  { id: 't18', date: '2026-11-17', note: 'Ojek online antar anak sekolah', category: 'transport', kind: 'keluar', amount: 60000 },
  { id: 't19', date: '2026-11-18', note: 'Buku & alat tulis anak', category: 'pendidikan', kind: 'keluar', amount: 120000 },
  { id: 't20', date: '2026-11-19', note: 'Kontrol dokter gigi anak', category: 'kesehatan', kind: 'keluar', amount: 200000 },
  { id: 't21', date: '2026-11-20', note: 'Langganan streaming keluarga', category: 'hiburan', kind: 'keluar', amount: 65000 },
  { id: 't22', date: '2026-11-21', note: 'Nonton bioskop keluarga', category: 'hiburan', kind: 'keluar', amount: 120000 },
  { id: 't23', date: '2026-11-22', note: 'Belanja sayur & ikan pasar', category: 'belanja', kind: 'keluar', amount: 165000 },
  { id: 't24', date: '2026-11-23', note: 'Makan siang kantor Ahmad', category: 'makan', kind: 'keluar', amount: 45000 },
  { id: 't25', date: '2026-11-24', note: 'Iuran RT & kebersihan', category: 'belanja', kind: 'keluar', amount: 50000 },
  { id: 't26', date: '2026-11-25', note: 'Parkir & tol harian', category: 'transport', kind: 'keluar', amount: 75000 },
  { id: 't27', date: '2026-11-26', note: 'Beli buah & susu anak', category: 'belanja', kind: 'keluar', amount: 80000 },
  { id: 't28', date: '2026-11-26', note: 'Makan malam: ayam geprek takeaway', category: 'makan', kind: 'keluar', amount: 120000 },
];

// Ringkasan Oktober 2026 (bulan lalu) untuk halaman Laporan.
export const LAST_MONTH = {
  month: '2026-10',
  income: 9400000,
  expense: 6105000,
  byCategory: {
    belanja: 1420000,
    listrik: 310000,
    transport: 480000,
    makan: 860000,
    pendidikan: 1150000,
    kesehatan: 620000,
    hiburan: 265000,
    tabungan: 1000000,
  },
};

export const formatIDR = (n) =>
  'Rp ' + Number(n || 0).toLocaleString('id-ID');

export const formatDateID = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d} ${names[m - 1]} ${y}`;
};

export const sumByKind = (txs, kind) =>
  txs.filter((t) => t.kind === kind).reduce((a, t) => a + t.amount, 0);

export const sumByCategory = (txs, category) =>
  txs.filter((t) => t.category === category && t.kind === 'keluar')
    .reduce((a, t) => a + t.amount, 0);
