/* ==========================================================================
   ORDER & INVOICE TRACKER - MAIN APPLICATION LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  let ordersData = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let selectedIds = new Set();
  let currentActiveInvoiceId = null;

  // --- DOM ELEMENTS ---
  const excelFileInput = document.getElementById('excelFileInput');
  const btnLoadDemo = document.getElementById('btnLoadDemo');
  const btnEmptyLoadDemo = document.getElementById('btnEmptyLoadDemo');
  const btnExportExcel = document.getElementById('btnExportExcel');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const filterTabs = document.querySelectorAll('.tab-btn');

  const emptyState = document.getElementById('emptyState');
  const tableWrapper = document.getElementById('tableWrapper');
  const tableBody = document.getElementById('tableBody');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');

  const batchBar = document.getElementById('batchBar');
  const selectedCountEl = document.getElementById('selectedCount');
  const btnBatchPrint = document.getElementById('btnBatchPrint');
  const btnBatchUnprint = document.getElementById('btnBatchUnprint');
  const btnDeselectAll = document.getElementById('btnDeselectAll');

  // Stats Counters
  const statTotalOrders = document.getElementById('statTotalOrders');
  const statUnprinted = document.getElementById('statUnprinted');
  const statPrinted = document.getElementById('statPrinted');
  const statUnpaid = document.getElementById('statUnpaid');

  const countAll = document.getElementById('countAll');
  const countUnprinted = document.getElementById('countUnprinted');
  const countPrinted = document.getElementById('countPrinted');
  const countUnpaid = document.getElementById('countUnpaid');

  // Invoice Modal Elements
  const invoiceModal = document.getElementById('invoiceModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCloseModalBtn = document.getElementById('btnCloseModalBtn');
  const btnPrintInvoiceNow = document.getElementById('btnPrintInvoiceNow');

  const modalOrderNo = document.getElementById('modalOrderNo');
  const modalInvoiceNo = document.getElementById('modalInvoiceNo');
  const modalDate = document.getElementById('modalDate');
  const modalCustomer = document.getElementById('modalCustomer');
  const modalPaymentStatus = document.getElementById('modalPaymentStatus');
  const modalPrintTimestamp = document.getElementById('modalPrintTimestamp');
  const modalPrintStatusTag = document.getElementById('modalPrintStatusTag');
  const modalItemsBody = document.getElementById('modalItemsBody');
  const modalTotalAmount = document.getElementById('modalTotalAmount');

  // Initialize Lucide Icons
  lucide.createIcons();

  // --- THEME TOGGLE ---
  btnThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
    lucide.createIcons();
    showToast(isLight ? 'Tema Terang Diaktifkan' : 'Tema Gelap Diaktifkan', 'info');
  });

  // --- DEMO DATA LOADER ---
  const sampleData = [
    {
      id: '1',
      orderNo: 'ORD-2026-8821',
      invoiceNo: 'INV-2026-0901',
      date: '2026-09-01',
      customer: 'Toko Jaya Abadi (Bpk. Hendra)',
      amount: 1500000,
      paymentStatus: 'Lunas',
      printedStatus: 'Belum Diprint',
      printedAt: '-',
      items: [
        { name: 'Kertas HVS A4 80gr (5 Rim)', qty: 2, price: 250000, total: 500000 },
        { name: 'Tinta Printer Epson Black 664', qty: 4, price: 250000, total: 1000000 }
      ]
    },
    {
      id: '2',
      orderNo: 'ORD-2026-8822',
      invoiceNo: 'INV-2026-0902',
      date: '2026-09-02',
      customer: 'Budi Santoso',
      amount: 750000,
      paymentStatus: 'Belum Lunas',
      printedStatus: 'Belum Diprint',
      printedAt: '-',
      items: [
        { name: 'Mouse Wireless Ergonomis', qty: 1, price: 350000, total: 350000 },
        { name: 'Keyboard Mechanical RGB', qty: 1, price: 400000, total: 400000 }
      ]
    },
    {
      id: '3',
      orderNo: 'ORD-2026-8823',
      invoiceNo: 'INV-2026-0903',
      date: '2026-09-03',
      customer: 'CV Maju Bersama Fulfill',
      amount: 4200000,
      paymentStatus: 'Lunas',
      printedStatus: 'Sudah Diprint',
      printedAt: '2026-09-04 10:15',
      items: [
        { name: 'Printer Thermal Kasir 80mm', qty: 2, price: 1600000, total: 3200000 },
        { name: 'Kertas Thermal Roll 80x80 (Box)', qty: 2, price: 500000, total: 1000000 }
      ]
    },
    {
      id: '4',
      orderNo: 'ORD-2026-8824',
      invoiceNo: 'INV-2026-0904',
      date: '2026-09-04',
      customer: 'Siti Rahmawati',
      amount: 320000,
      paymentStatus: 'Lunas',
      printedStatus: 'Sudah Diprint',
      printedAt: '2026-09-05 14:20',
      items: [
        { name: 'Stationery Set Complete', qty: 1, price: 320000, total: 320000 }
      ]
    },
    {
      id: '5',
      orderNo: 'ORD-2026-8825',
      invoiceNo: 'INV-2026-0905',
      date: '2026-09-05',
      customer: 'PT Teknologi Mandiri',
      amount: 12500000,
      paymentStatus: 'Belum Lunas',
      printedStatus: 'Belum Diprint',
      printedAt: '-',
      items: [
        { name: 'Monitor LED 27 Inch 4K', qty: 3, price: 3500000, total: 10500000 },
        { name: 'Standing Desk Converter', qty: 1, price: 2000000, total: 2000000 }
      ]
    },
    {
      id: '6',
      orderNo: 'ORD-2026-8826',
      invoiceNo: 'INV-2026-0906',
      date: '2026-09-06',
      customer: 'Ahmad Fauzi',
      amount: 890000,
      paymentStatus: 'Lunas',
      printedStatus: 'Belum Diprint',
      printedAt: '-',
      items: [
        { name: 'Headset Gaming Surround 7.1', qty: 1, price: 890000, total: 890000 }
      ]
    }
  ];

  function loadDemoData() {
    ordersData = JSON.parse(JSON.stringify(sampleData));
    selectedIds.clear();
    renderApp();
    showToast('6 Contoh Data Transaksi Berhasil Dimuat!', 'success');
  }

  btnLoadDemo.addEventListener('click', loadDemoData);
  btnEmptyLoadDemo.addEventListener('click', loadDemoData);

  // --- EXCEL IMPORT LOGIC ---
  excelFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('File Excel kosong atau format tidak valid.', 'info');
          return;
        }

        // Map columns dynamically
        ordersData = rawJson.map((row, idx) => {
          // Detect headers smartly
          const keys = Object.keys(row);
          const findKey = (candidates) => {
            const found = keys.find(k => candidates.some(c => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(c)));
            return found ? row[found] : '';
          };

          const orderNo = String(findKey(['order', 'noorder', 'orderno', 'nomororder']) || `ORD-EXCEL-${idx+1}`);
          const invoiceNo = String(findKey(['invoice', 'noinv', 'invoiceno', 'nomorinvoice', 'inv']) || `INV-EXCEL-${idx+1}`);
          const date = String(findKey(['tanggal', 'date', 'tgl']) || new Date().toISOString().split('T')[0]);
          const customer = String(findKey(['pelanggan', 'customer', 'nama', 'buyer']) || 'Pelanggan General');
          const rawAmount = findKey(['nominal', 'total', 'amount', 'harga', 'subtotal']);
          const amount = Number(String(rawAmount).replace(/[^0-9]/g, '')) || 500000;
          
          const rawStatus = String(findKey(['status', 'bayar', 'payment'])).toLowerCase();
          const paymentStatus = (rawStatus.includes('lunas') || rawStatus.includes('paid')) ? 'Lunas' : 'Belum Lunas';

          const rawPrint = String(findKey(['print', 'cetak', 'printed'])).toLowerCase();
          const printedStatus = (rawPrint.includes('sudah') || rawPrint.includes('yes') || rawPrint.includes('true') || rawPrint.includes('1')) 
            ? 'Sudah Diprint' : 'Belum Diprint';

          return {
            id: `excel-${Date.now()}-${idx}`,
            orderNo: orderNo.trim(),
            invoiceNo: invoiceNo.trim(),
            date: date.trim(),
            customer: customer.trim(),
            amount: amount,
            paymentStatus: paymentStatus,
            printedStatus: printedStatus,
            printedAt: printedStatus === 'Sudah Diprint' ? new Date().toLocaleString('id-ID') : '-',
            items: [
              { name: `Item dari Order ${orderNo}`, qty: 1, price: amount, total: amount }
            ]
          };
        });

        selectedIds.clear();
        renderApp();
        showToast(`Berhasil mengimport ${ordersData.length} data dari Excel!`, 'success');
        excelFileInput.value = '';
      } catch (err) {
        console.error(err);
        showToast('Gagal membaca file Excel. Pastikan format file benar.', 'info');
      }
    };
    reader.readAsArrayBuffer(file);
  });

  // --- EXCEL EXPORT LOGIC ---
  btnExportExcel.addEventListener('click', () => {
    if (ordersData.length === 0) return;

    const exportRows = ordersData.map(item => ({
      'No Order': item.orderNo,
      'No Invoice': item.invoiceNo,
      'Tanggal': item.date,
      'Nama Pelanggan': item.customer,
      'Total Nominal (IDR)': item.amount,
      'Status Pembayaran': item.paymentStatus,
      'Status Print': item.printedStatus,
      'Waktu Print': item.printedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Invoice Tracker");
    
    const fileName = `Order_Invoice_Tracker_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    showToast(`Data berhasil diexport ke ${fileName}`, 'success');
  });

  // --- SEARCH & FILTER LOGIC ---
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    btnClearSearch.classList.toggle('hidden', searchQuery === '');
    renderTable();
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    btnClearSearch.classList.add('hidden');
    renderTable();
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderTable();
    });
  });

  // --- RENDER APPLICATION STATE ---
  function renderApp() {
    const hasData = ordersData.length > 0;
    emptyState.classList.toggle('hidden', hasData);
    tableWrapper.classList.toggle('hidden', !hasData);
    btnExportExcel.disabled = !hasData;

    updateStats();
    renderTable();
  }

  function updateStats() {
    const total = ordersData.length;
    const unprinted = ordersData.filter(d => d.printedStatus === 'Belum Diprint').length;
    const printed = ordersData.filter(d => d.printedStatus === 'Sudah Diprint').length;
    const unpaid = ordersData.filter(d => d.paymentStatus === 'Belum Lunas').length;

    statTotalOrders.textContent = total;
    statUnprinted.textContent = unprinted;
    statPrinted.textContent = printed;
    statUnpaid.textContent = unpaid;

    countAll.textContent = total;
    countUnprinted.textContent = unprinted;
    countPrinted.textContent = printed;
    countUnpaid.textContent = unpaid;
  }

  function getFilteredData() {
    return ordersData.filter(item => {
      // Apply tab filter
      if (currentFilter === 'unprinted' && item.printedStatus !== 'Belum Diprint') return false;
      if (currentFilter === 'printed' && item.printedStatus !== 'Sudah Diprint') return false;
      if (currentFilter === 'unpaid' && item.paymentStatus !== 'Belum Lunas') return false;

      // Apply search filter
      if (searchQuery) {
        const matchOrder = item.orderNo.toLowerCase().includes(searchQuery);
        const matchInvoice = item.invoiceNo.toLowerCase().includes(searchQuery);
        const matchCustomer = item.customer.toLowerCase().includes(searchQuery);
        return matchOrder || matchInvoice || matchCustomer;
      }

      return true;
    });
  }

  function renderTable() {
    const filtered = getFilteredData();
    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 40px; color: var(--text-muted);">
            <i data-lucide="search-x" style="width:32px; height:32px; margin-bottom:8px;"></i>
            <p>Tidak ada transaksi yang cocok dengan kriteria pencarian/filter Anda.</p>
          </td>
        </tr>
      `;
      lucide.createIcons();
      updateBatchBar();
      return;
    }

    filtered.forEach(item => {
      const isSelected = selectedIds.has(item.id);
      const isMatch = searchQuery && (
        item.orderNo.toLowerCase().includes(searchQuery) ||
        item.invoiceNo.toLowerCase().includes(searchQuery)
      );

      const tr = document.createElement('tr');
      if (isMatch) tr.classList.add('highlight-match');

      const isPrinted = item.printedStatus === 'Sudah Diprint';
      const isPaid = item.paymentStatus === 'Lunas';

      tr.innerHTML = `
        <td>
          <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td>
          <span class="code-pill code-pill-order">${highlightText(item.orderNo, searchQuery)}</span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="code-pill code-pill-inv">${highlightText(item.invoiceNo, searchQuery)}</span>
            <button class="btn-icon btn-copy-inv" data-inv="${item.invoiceNo}" title="Salin No. Invoice" style="width:26px; height:26px;">
              <i data-lucide="copy" style="width:14px; height:14px;"></i>
            </button>
          </div>
        </td>
        <td>${item.date}</td>
        <td><strong>${item.customer}</strong></td>
        <td>Rp ${item.amount.toLocaleString('id-ID')}</td>
        <td>
          <span class="badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">
            ${isPaid ? '✓ Lunas' : '⏳ Belum Lunas'}
          </span>
        </td>
        <td>
          <button class="badge ${isPrinted ? 'badge-printed' : 'badge-unprinted'} btn-toggle-print" data-id="${item.id}" style="cursor:pointer; border:none;">
            ${isPrinted ? '🟢 Sudah Diprint' : '🟡 Belum Diprint'}
          </button>
        </td>
        <td>
          <div class="action-cell">
            <button class="btn btn-sm btn-secondary btn-view-invoice" data-id="${item.id}" title="Lihat & Cetak Invoice">
              <i data-lucide="printer" style="width:14px; height:14px;"></i>
              <span>Print</span>
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    lucide.createIcons();
    attachTableEventListeners();
    updateBatchBar();
  }

  function highlightText(text, query) {
    if (!query) return text;
    const reg = new RegExp(`(${query})`, 'gi');
    return text.replace(reg, '<mark style="background:#f59e0b; color:#000; padding:0 2px; border-radius:2px;">$1</mark>');
  }

  // --- TABLE EVENT LISTENERS ---
  function attachTableEventListeners() {
    // Row Checkbox toggle
    document.querySelectorAll('.row-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) selectedIds.add(id);
        else selectedIds.delete(id);
        updateBatchBar();
      });
    });

    // Copy Invoice No
    document.querySelectorAll('.btn-copy-inv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const inv = btn.dataset.inv;
        navigator.clipboard.writeText(inv);
        showToast(`No. Invoice ${inv} tersalin!`, 'info');
      });
    });

    // Toggle Print Status directly from table badge
    document.querySelectorAll('.btn-toggle-print').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const targetOrder = ordersData.find(o => o.id === id);
        if (targetOrder) {
          if (targetOrder.printedStatus === 'Belum Diprint') {
            targetOrder.printedStatus = 'Sudah Diprint';
            targetOrder.printedAt = new Date().toLocaleString('id-ID');
            showToast(`Status ${targetOrder.orderNo} diubah menjadi 'Sudah Diprint'`, 'success');
          } else {
            targetOrder.printedStatus = 'Belum Diprint';
            targetOrder.printedAt = '-';
            showToast(`Status ${targetOrder.orderNo} diubah menjadi 'Belum Diprint'`, 'info');
          }
          updateStats();
          renderTable();
        }
      });
    });

    // Open Printable Invoice Modal
    document.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openInvoiceModal(id);
      });
    });
  }

  // Select All Checkbox
  selectAllCheckbox.addEventListener('change', (e) => {
    const filtered = getFilteredData();
    if (e.target.checked) {
      filtered.forEach(item => selectedIds.add(item.id));
    } else {
      selectedIds.clear();
    }
    renderTable();
  });

  function updateBatchBar() {
    const count = selectedIds.size;
    batchBar.classList.toggle('hidden', count === 0);
    selectedCountEl.textContent = `${count} transaksi dipilih`;
  }

  btnDeselectAll.addEventListener('click', () => {
    selectedIds.clear();
    selectAllCheckbox.checked = false;
    renderTable();
  });

  btnBatchPrint.addEventListener('click', () => {
    selectedIds.forEach(id => {
      const order = ordersData.find(o => o.id === id);
      if (order) {
        order.printedStatus = 'Sudah Diprint';
        order.printedAt = new Date().toLocaleString('id-ID');
      }
    });
    showToast(`${selectedIds.size} transaksi ditandai Sudah Diprint`, 'success');
    selectedIds.clear();
    selectAllCheckbox.checked = false;
    updateStats();
    renderTable();
  });

  btnBatchUnprint.addEventListener('click', () => {
    selectedIds.forEach(id => {
      const order = ordersData.find(o => o.id === id);
      if (order) {
        order.printedStatus = 'Belum Diprint';
        order.printedAt = '-';
      }
    });
    showToast(`${selectedIds.size} transaksi ditandai Belum Diprint`, 'info');
    selectedIds.clear();
    selectAllCheckbox.checked = false;
    updateStats();
    renderTable();
  });

  // --- INVOICE MODAL SYSTEM ---
  function openInvoiceModal(id) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return;

    currentActiveInvoiceId = id;
    modalOrderNo.textContent = order.orderNo;
    modalInvoiceNo.textContent = order.invoiceNo;
    modalDate.textContent = order.date;
    modalCustomer.textContent = order.customer;
    modalPaymentStatus.textContent = order.paymentStatus;
    modalPaymentStatus.className = `status-pill ${order.paymentStatus === 'Lunas' ? 'badge-paid' : 'badge-unpaid'}`;
    modalPrintTimestamp.textContent = order.printedAt;

    modalPrintStatusTag.textContent = order.printedStatus.toUpperCase();
    modalPrintStatusTag.style.background = order.printedStatus === 'Sudah Diprint' ? '#dcfce7' : '#fef3c7';
    modalPrintStatusTag.style.color = order.printedStatus === 'Sudah Diprint' ? '#15803d' : '#b45309';

    // Populate items
    modalItemsBody.innerHTML = order.items.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">Rp ${item.price.toLocaleString('id-ID')}</td>
        <td class="text-right">Rp ${item.total.toLocaleString('id-ID')}</td>
      </tr>
    `).join('');

    modalTotalAmount.textContent = `Rp ${order.amount.toLocaleString('id-ID')}`;

    invoiceModal.classList.remove('hidden');
  }

  function closeInvoiceModal() {
    invoiceModal.classList.add('hidden');
    currentActiveInvoiceId = null;
  }

  btnCloseModal.addEventListener('click', closeInvoiceModal);
  btnCloseModalBtn.addEventListener('click', closeInvoiceModal);

  // Trigger Print Action
  btnPrintInvoiceNow.addEventListener('click', () => {
    if (!currentActiveInvoiceId) return;

    const order = ordersData.find(o => o.id === currentActiveInvoiceId);
    if (order) {
      // Auto mark as printed!
      order.printedStatus = 'Sudah Diprint';
      order.printedAt = new Date().toLocaleString('id-ID');
      updateStats();
      renderTable();
    }

    // Trigger Native Browser Print Dialog
    window.print();
    showToast(`Invoice ${order.invoiceNo} dicetak & status diperbarui ke 'Sudah Diprint'`, 'success');
    closeInvoiceModal();
  });

  // --- TOAST SYSTEM ---
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle-2' : 'info'}"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
