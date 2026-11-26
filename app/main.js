// Dompet Keluarga — main.js: state, routing hash, filter, dan form transaksi.
// State tersimpan di localStorage (kunci dompet-keluarga-v1) sehingga catatan
// pengguna bertahan saat halaman dimuat ulang; data awal dari data.js dipakai
// saat belum ada simpanan.
import { BUDGETS, CATEGORIES, LAST_MONTH, SEED_TRANSACTIONS, categoryLabel, formatIDR, sumByKind, totalBudget } from './data.js';
import { budgetRows, renderCategoryChart, renderCompareChart, renderKpis, renderRecentTx, renderShareList, renderTxTable } from './ui.js';

const STORE_KEY = 'dompet-keluarga-v1';
const VIEWS = ['dashboard', 'transaksi', 'anggaran', 'laporan'];

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [...SEED_TRANSACTIONS];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [...SEED_TRANSACTIONS];
    return parsed;
  } catch {
    return [...SEED_TRANSACTIONS];
  }
}

function saveTransactions(txs) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(txs)); } catch { /* penyimpanan penuh: tetap jalan di memori */ }
}

let transactions = loadTransactions();
let editingId = null;

const $ = (id) => document.getElementById(id);

function currentRoute() {
  const hash = (location.hash || '#/dashboard').replace(/^#\/?/, '');
  return VIEWS.includes(hash) ? hash : 'dashboard';
}

function showRoute() {
  const route = currentRoute();
  VIEWS.forEach((v) => { $('view-' + v).hidden = v !== route; });
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
  window.scrollTo(0, 0);
  if (route === 'dashboard') renderDashboard();
  if (route === 'anggaran') renderBudgetPage();
  if (route === 'laporan') renderReport();
  if (route === 'transaksi') renderTxList();
}

function renderDashboard() {
  const month = $('monthSelect').value;
  const txs = transactions.filter((t) => t.date.startsWith(month));
  const income = sumByKind(txs, 'masuk');
  const expense = sumByKind(txs, 'keluar');
  const balance = income - expense;
  $('heroBalance').textContent = formatIDR(balance);
  $('heroBalanceSub').textContent = month === '2026-11'
    ? 'Sisa setelah semua pengeluaran November'
    : 'Sisa setelah semua pengeluaran Oktober';
  const pctLeft = income ? Math.max(0, Math.round((balance / income) * 100)) : 0;
  $('heroMeter').style.width = pctLeft + '%';
  $('heroMeter').parentElement.nextElementSibling.textContent = pctLeft + '% pemasukan belum terpakai';
  $('kpiRow').innerHTML = renderKpis(txs);
  $('catChart').innerHTML = renderCategoryChart(txs);
  $('recentTx').innerHTML = renderRecentTx(txs);
  $('budgetPreview').innerHTML = budgetRows(txs, false);
}

function renderBudgetPage() {
  const txs = transactions.filter((t) => t.date.startsWith('2026-11'));
  const expense = sumByKind(txs, 'keluar');
  const budget = totalBudget();
  $('budgetKpis').innerHTML = `
    <div class="kpi"><p class="k-label">Total anggaran</p><p class="k-value">${formatIDR(budget)}</p><p class="k-sub">8 kategori, November 2026</p></div>
    <div class="kpi"><p class="k-label">Sudah terpakai</p><p class="k-value">${formatIDR(expense)}</p><p class="k-sub">${Math.round((expense / budget) * 100)}% dari anggaran</p></div>
    <div class="kpi"><p class="k-label">Sisa anggaran</p><p class="k-value">${formatIDR(Math.max(0, budget - expense))}</p><p class="k-sub">Untuk 3 hari terakhir bulan ini</p></div>
    <div class="kpi"><p class="k-label">Kategori melebihi batas</p><p class="k-value">${Object.keys(BUDGETS).filter((id) => txs.filter((t) => t.category === id && t.kind === 'keluar').reduce((a, t) => a + t.amount, 0) > BUDGETS[id]).length} kategori</p><p class="k-sub">Kesehatan melewati batas Rp 35.000</p></div>`;
  $('budgetList').innerHTML = budgetRows(txs, true);
}

function renderReport() {
  const txs = transactions.filter((t) => t.date.startsWith('2026-11'));
  const income = sumByKind(txs, 'masuk');
  const expense = sumByKind(txs, 'keluar');
  const dInc = income - LAST_MONTH.income;
  const dExp = expense - LAST_MONTH.expense;
  $('reportKpis').innerHTML = `
    <div class="kpi"><p class="k-label">Pemasukan Nov vs Okt</p><p class="k-value">${formatIDR(income)}</p><p class="k-sub"><span class="up">+${formatIDR(dInc)}</span> dari ${formatIDR(LAST_MONTH.income)}</p></div>
    <div class="kpi"><p class="k-label">Pengeluaran Nov vs Okt</p><p class="k-value">${formatIDR(expense)}</p><p class="k-sub"><span class="up">${dExp <= 0 ? formatIDR(-dExp) + ' (turun)' : '+' + formatIDR(dExp)}</span> dari ${formatIDR(LAST_MONTH.expense)}</p></div>
    <div class="kpi"><p class="k-label">Tabungan bulan ini</p><p class="k-value">${formatIDR(income - expense)}</p><p class="k-sub">Naik ${formatIDR((income - expense) - (LAST_MONTH.income - LAST_MONTH.expense))} vs Oktober</p></div>
    <div class="kpi"><p class="k-label">Rasio tabungan</p><p class="k-value">${income ? Math.round(((income - expense) / income) * 100) : 0}%</p><p class="k-sub">Dari setiap Rp 100 pemasukan</p></div>`;
  $('compareChart').innerHTML = renderCompareChart(txs, LAST_MONTH);
  $('shareList').innerHTML = renderShareList(txs);
}

function filteredTransactions() {
  const q = $('q').value.trim().toLowerCase();
  const kind = $('fKind').value;
  const cat = $('fCat').value;
  const month = $('fMonth').value;
  return transactions.filter((t) =>
    (!q || t.note.toLowerCase().includes(q) || categoryLabel(t.category).toLowerCase().includes(q)) &&
    (!kind || t.kind === kind) &&
    (!cat || t.category === cat) &&
    (!month || t.date.startsWith(month)));
}

function renderTxList() {
  const list = filteredTransactions();
  $('txBody').innerHTML = renderTxTable(list);
  $('txEmpty').hidden = list.length > 0;
  const totalOut = list.filter((t) => t.kind === 'keluar').reduce((a, t) => a + t.amount, 0);
  const totalIn = list.filter((t) => t.kind === 'masuk').reduce((a, t) => a + t.amount, 0);
  $('txCount').textContent = `Menampilkan ${list.length} dari ${transactions.length} transaksi — masuk ${formatIDR(totalIn)}, keluar ${formatIDR(totalOut)}.`;
}

function fillCategorySelects() {
  const expenseCats = CATEGORIES.filter((c) => c.kind === 'keluar');
  $('fCategory').innerHTML = [...CATEGORIES].map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  $('fCat').innerHTML = '<option value="">Semua kategori</option>' +
    CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  void expenseCats;
}

function openForm(tx) {
  editingId = tx ? tx.id : null;
  $('formTitle').textContent = tx ? 'Ubah transaksi' : 'Tambah transaksi';
  $('fType').value = tx ? tx.kind : 'keluar';
  $('fAmount').value = tx ? tx.amount : '';
  $('fCategory').value = tx ? tx.category : 'belanja';
  $('fDate').value = tx ? tx.date : '2026-11-27';
  $('fNote').value = tx ? tx.note : '';
  $('formError').hidden = true;
  $('txForm').hidden = false;
  $('txForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('fAmount').focus();
}

function closeForm() {
  $('txForm').hidden = true;
  editingId = null;
}

function submitForm(event) {
  event.preventDefault();
  const amount = Number($('fAmount').value);
  const note = $('fNote').value.trim();
  const date = $('fDate').value;
  const err = $('formError');
  if (!amount || amount < 1000) { err.textContent = 'Jumlah minimal Rp 1.000.'; err.hidden = false; return; }
  if (!note) { err.textContent = 'Keterangan wajib diisi.'; err.hidden = false; return; }
  if (!date) { err.textContent = 'Tanggal wajib diisi.'; err.hidden = false; return; }
  const record = {
    id: editingId || ('u' + Date.now().toString(36)),
    date,
    note,
    category: $('fCategory').value,
    kind: $('fType').value,
    amount: Math.round(amount),
  };
  if (editingId) {
    transactions = transactions.map((t) => (t.id === editingId ? record : t));
  } else {
    transactions = [record, ...transactions];
  }
  saveTransactions(transactions);
  closeForm();
  renderTxList();
  renderDashboard();
}

function onTableClick(event) {
  const editBtn = event.target.closest('[data-edit]');
  const delBtn = event.target.closest('[data-delete]');
  const budgetBtn = event.target.closest('[data-edit-budget]');
  if (budgetBtn) {
    const id = budgetBtn.dataset.editBudget;
    const current = BUDGETS[id];
    const next = window.prompt(`Ubah anggaran ${categoryLabel(id)} (saat ini ${formatIDR(current)}). Masukkan angka baru dalam rupiah:`, String(current));
    if (next === null) return;
    const value = Number(String(next).replace(/[^0-9]/g, ''));
    if (value >= 50000) {
      BUDGETS[id] = value;
      renderBudgetPage();
      renderDashboard();
    } else {
      window.alert('Anggaran minimal Rp 50.000.');
    }
    return;
  }
  if (editBtn) {
    const tx = transactions.find((t) => t.id === editBtn.dataset.edit);
    if (tx) openForm(tx);
    return;
  }
  if (delBtn) {
    const tx = transactions.find((t) => t.id === delBtn.dataset.delete);
    if (tx && window.confirm(`Hapus transaksi "${tx.note}" (${formatIDR(tx.amount)})?`)) {
      transactions = transactions.filter((t) => t.id !== tx.id);
      saveTransactions(transactions);
      renderTxList();
      renderDashboard();
    }
  }
}

function init() {
  fillCategorySelects();
  $('monthSelect').addEventListener('change', renderDashboard);
  ['q', 'fKind', 'fCat', 'fMonth'].forEach((id) => $(id).addEventListener('input', renderTxList));
  $('resetFilters').addEventListener('click', () => {
    $('q').value = ''; $('fKind').value = ''; $('fCat').value = ''; $('fMonth').value = '2026-11';
    renderTxList();
  });
  $('showFormBtn').addEventListener('click', () => openForm(null));
  $('cancelFormBtn').addEventListener('click', closeForm);
  $('txForm').addEventListener('submit', submitForm);
  $('txBody').addEventListener('click', onTableClick);
  $('budgetList').addEventListener('click', onTableClick);
  window.addEventListener('hashchange', showRoute);
  showRoute();
}

init();
