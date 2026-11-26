// Dompet Keluarga — ui.js: semua fungsi render (KPI, grafik batang,
// daftar transaksi, baris anggaran, perbandingan laporan). Tidak menyimpan
// state; semua data masuk lewat argumen dari main.js.
import { BUDGETS, categoryLabel, formatDateID, formatIDR, sumByCategory, sumByKind, totalBudget } from './data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderKpis(txs) {
  const income = sumByKind(txs, 'masuk');
  const expense = sumByKind(txs, 'keluar');
  const balance = income - expense;
  const budget = totalBudget();
  const usedPct = budget ? Math.round((expense / budget) * 100) : 0;
  const cards = [
    { label: 'Pemasukan bulan ini', value: formatIDR(income), sub: 'Gaji Rp 8.500.000 + freelance Rp 1.200.000' },
    { label: 'Pengeluaran bulan ini', value: formatIDR(expense), sub: `${txs.filter((t) => t.kind === 'keluar').length} transaksi tercatat` },
    { label: 'Sisa uang (saldo)', value: formatIDR(balance), sub: 'Pemasukan dikurangi pengeluaran', good: balance >= 0 },
    { label: 'Anggaran terpakai', value: `${usedPct}% dari ${formatIDR(budget)}`, sub: expense > budget ? 'Melebihi total anggaran' : 'Masih dalam total anggaran' },
  ];
  return cards.map((c) => `
    <div class="kpi">
      <p class="k-label">${c.label}</p>
      <p class="k-value">${c.value}</p>
      <p class="k-sub">${c.sub}</p>
    </div>`).join('');
}

export function renderCategoryChart(txs) {
  const cats = Object.keys(BUDGETS);
  const rows = cats.map((id) => ({ id, label: categoryLabel(id), amount: sumByCategory(txs, id) }));
  const max = Math.max(1, ...rows.map((r) => r.amount));
  return rows.map((r) => {
    const pct = Math.round((r.amount / max) * 100);
    const cls = r.amount > BUDGETS[r.id] ? 'bar-fill red' : 'bar-fill';
    return `<div class="bar-row">
      <span class="bar-label">${r.label}</span>
      <span class="bar-track"><span class="${cls}" style="display:block;width:${pct}%"></span></span>
      <span class="bar-val">${formatIDR(r.amount)}</span>
    </div>`;
  }).join('');
}

export function renderRecentTx(txs, count = 6) {
  const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return sorted.slice(0, count).map((t) => `
    <li>
      <div><div class="tx-note">${esc(t.note)}</div>
      <div class="tx-meta">${formatDateID(t.date)} · ${categoryLabel(t.category)}</div></div>
      <span class="tx-amt ${t.kind === 'masuk' ? 'in' : 'out'}">${t.kind === 'masuk' ? '+' : '−'} ${formatIDR(t.amount)}</span>
    </li>`).join('');
}

export function budgetRows(txs, editable) {
  return Object.keys(BUDGETS).map((id) => {
    const spent = sumByCategory(txs, id);
    const limit = BUDGETS[id];
    const pct = Math.min(100, Math.round((spent / limit) * 100));
    const over = spent > limit;
    const left = limit - spent;
    const cls = over ? 'bar-fill red' : (pct >= 90 ? 'bar-fill amber' : 'bar-fill');
    const badge = over
      ? `<span class="badge-over">LEBIH ${formatIDR(spent - limit)}</span>`
      : `<span class="badge-ok">${pct}% terpakai</span>`;
    const editBtn = editable
      ? `<button class="btn btn-small" type="button" data-edit-budget="${id}">Ubah</button>`
      : '';
    return `<div class="budget-row${over ? ' over' : ''}">
      <span class="b-name">${categoryLabel(id)}</span>
      <span class="bar-track"><span class="${cls}" style="display:block;width:${pct}%"></span></span>
      <span class="b-amt"><strong>${formatIDR(spent)}</strong><span>dari ${formatIDR(limit)} · ${over ? 'lebih ' + formatIDR(spent - limit) : 'sisa ' + formatIDR(left)}</span></span>
      <span class="b-actions">${badge} ${editBtn}</span>
    </div>`;
  }).join('');
}

export function renderTxTable(txs) {
  if (!txs.length) return '';
  const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return sorted.map((t) => `
    <tr>
      <td>${formatDateID(t.date)}</td>
      <td>${esc(t.note)}</td>
      <td>${categoryLabel(t.category)}</td>
      <td><span class="pill ${t.kind === 'masuk' ? 'in' : 'out'}">${t.kind === 'masuk' ? 'Masuk' : 'Keluar'}</span></td>
      <td class="num"><strong>${t.kind === 'masuk' ? '+' : '−'} ${formatIDR(t.amount)}</strong></td>
      <td><span class="row-actions">
        <button class="btn btn-small" type="button" data-edit="${t.id}">Ubah</button>
        <button class="btn btn-danger" type="button" data-delete="${t.id}">Hapus</button>
      </span></td>
    </tr>`).join('');
}

export function renderCompareChart(txs, lastMonth) {
  const cats = Object.keys(BUDGETS);
  const rows = cats.map((id) => ({
    label: categoryLabel(id),
    now: sumByCategory(txs, id),
    then: lastMonth.byCategory[id] || 0,
  }));
  const max = Math.max(1, ...rows.flatMap((r) => [r.now, r.then]));
  return rows.map((r) => {
    const diff = r.now - r.then;
    const diffText = diff === 0 ? 'sama' : (diff > 0 ? `+${formatIDR(diff)}` : `−${formatIDR(-diff)}`);
    return `<div class="bar-row">
      <span class="bar-label">${r.label}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.round((r.now / max) * 100)}%"></span></span>
      <span class="bar-val">${formatIDR(r.now)}</span>
    </div>
    <p class="note cmp-note">Oktober: ${formatIDR(r.then)} · ${diffText} vs bulan lalu</p>`;
  }).join('');
}

export function renderShareList(txs) {
  const expense = sumByKind(txs, 'keluar');
  const rows = Object.keys(BUDGETS)
    .map((id) => ({ label: categoryLabel(id), amount: sumByCategory(txs, id) }))
    .sort((a, b) => b.amount - a.amount);
  const max = Math.max(1, ...rows.map((r) => r.amount));
  return rows.map((r) => {
    const share = expense ? Math.round((r.amount / expense) * 100) : 0;
    return `<div class="share-row">
      <span>${r.label}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.round((r.amount / max) * 100)}%"></span></span>
      <strong>${share}%</strong>
    </div>`;
  }).join('');
}
