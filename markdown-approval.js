// Yashraj Kumar - FSD CIA-1B Prototype
// Handles markdown approval logic, filtering, and validation

// dummy inventory array simulating database response
let inventory = [
  { id: 1, name: 'Farm Fresh Paneer 200g',    category: 'Dairy',   hoursLeft: 3,  qty: 18, basePrice: 90,  markdown: null, status: 'pending' },
  { id: 2, name: 'Whole Wheat Bread Loaf',     category: 'Bakery',  hoursLeft: 5,  qty: 24, basePrice: 55,  markdown: null, status: 'pending' },
  { id: 3, name: 'Vine Tomatoes 1kg',          category: 'Produce', hoursLeft: 9,  qty: 40, basePrice: 48,  markdown: null, status: 'pending' },
  { id: 4, name: 'Greek Yogurt Cups (4-pack)', category: 'Dairy',   hoursLeft: 14, qty: 32, basePrice: 160, markdown: null, status: 'pending' },
  { id: 5, name: 'Chicken Breast Fillet 500g', category: 'Meat',    hoursLeft: 18, qty: 12, basePrice: 210, markdown: null, status: 'pending' },
  { id: 6, name: 'Mixed Berries Punnet',       category: 'Produce', hoursLeft: 22, qty: 20, basePrice: 130, markdown: null, status: 'pending' },
];

let activeFilter = 'all';
let approvedTotal = 0;
let valueProtected = 0;
let currentItemId = null;

// categorize items based on hours left
function urgencyTier(hours) {
  if (hours < 6)  return { label: 'Critical', color: 'red',   suggested: 40 };
  if (hours < 12) return { label: 'Urgent',   color: 'amber', suggested: 25 };
  return            { label: 'Watch',   color: 'cyan',  suggested: 15 };
}

// render the inventory list into the DOM
function renderInventory() {
  const list = document.getElementById('inventoryList');
  const empty = document.getElementById('inventoryEmpty');
  if (!list) return;

  // apply active filter
  let items = inventory.filter(it => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return it.hoursLeft < 6 && it.status !== 'approved';
    if (activeFilter === 'pending') return it.status === 'pending';
    if (activeFilter === 'approved') return it.status === 'approved';
  });

  list.innerHTML = '';
  empty.classList.toggle('hidden', items.length !== 0);

  const colorMap = {
    red:   'text-red-400 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan:  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  // build rows dynamically
  items.forEach((it, i) => {
    const tier = urgencyTier(it.hoursLeft);
    const isApproved = it.status === 'approved';
    const pulse = (tier.label === 'Critical' && !isApproved) ? 'urgent-pulse' : '';

    const row = document.createElement('div');
    row.className = `glass rounded-2xl p-5 row-fade flex flex-col sm:flex-row sm:items-center gap-4 ${pulse} ${isApproved ? 'opacity-60' : ''}`;
    row.style.animationDelay = (i * 0.05) + 's';
    
    row.innerHTML = `
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[tier.color]}">${tier.label} · ${it.hoursLeft}h left</span>
          <span class="text-xs text-slate-500">${it.category}</span>
          ${isApproved ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"><i class="fa-solid fa-check"></i> Approved ${it.markdown}%</span>` : ''}
        </div>
        <h4 class="text-white font-bold text-sm truncate">${it.name}</h4>
        <p class="text-xs text-slate-500 mt-0.5">Qty: ${it.qty} units · ₹${it.basePrice} base price</p>
      </div>
      <button onclick="openApprovalDrawer(${it.id})"
        class="${isApproved ? 'bg-slate-800 text-slate-400 cursor-default' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:-translate-y-0.5'} font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shrink-0 flex items-center justify-center gap-2"
        ${isApproved ? 'disabled' : ''}>
        ${isApproved ? '<i class="fa-solid fa-lock"></i> Locked' : '<i class="fa-solid fa-tag"></i> Review'}
      </button>
    `;
    list.appendChild(row);
  });

  updateWorkflowStats();
}

// recalculate and update header stats
function updateWorkflowStats() {
  const pending = inventory.filter(i => i.status === 'pending').length;
  const critical = inventory.filter(i => i.hoursLeft < 6 && i.status !== 'approved').length;

  const elPending  = document.getElementById('statPending');
  const elCritical = document.getElementById('statCritical');
  const elApproved = document.getElementById('statApproved');
  const elValue     = document.getElementById('statValue');

  if (elPending)  elPending.textContent  = pending;
  if (elCritical) elCritical.textContent = critical;
  if (elApproved) elApproved.textContent = approvedTotal;
  if (elValue)    elValue.textContent    = '₹' + valueProtected.toLocaleString('en-IN');
}

// setup category filters
function initFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      activeFilter = btn.dataset.filter;
      styleFilterButtons();
      renderInventory();
    });
  });
  styleFilterButtons();
}

const ACTIVE_CLASSES = ['bg-emerald-500', 'text-slate-950'];
const INACTIVE_CLASSES = ['bg-slate-800/60', 'text-slate-400', 'border', 'border-slate-700'];

function styleFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove(...ACTIVE_CLASSES, ...INACTIVE_CLASSES);
    const active = b.classList.contains('active-filter');
    b.classList.add(...(active ? ACTIVE_CLASSES : INACTIVE_CLASSES));
  });
}

// open side drawer for approvals
function openApprovalDrawer(id) {
  currentItemId = id;
  const it = inventory.find(x => x.id === id);
  const tier = urgencyTier(it.hoursLeft);

  document.getElementById('drawerContent').innerHTML = `
    <div class="mb-5">
      <p class="text-xs text-slate-500 mb-1">${it.category} · ${it.qty} units in stock</p>
      <h4 class="text-xl font-bold text-white">${it.name}</h4>
      <p class="text-sm text-slate-400 mt-1">Expires in <span class="text-amber-400 font-semibold">${it.hoursLeft} hours</span></p>
    </div>

    <div class="glass rounded-xl p-4 mb-5 border border-white/5">
      <p class="text-xs text-slate-500 mb-1">Current price</p>
      <p class="text-2xl font-extrabold text-white">₹${it.basePrice}.00</p>
    </div>

    <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Markdown percentage</label>
    <div class="flex items-center gap-4 mb-2">
      <input type="range" id="markdownSlider" min="5" max="70" step="5" value="${tier.suggested}" class="flex-1">
      <span id="markdownValue" class="text-emerald-400 font-extrabold text-xl w-16 text-right">${tier.suggested}%</span>
    </div>
    <p class="text-xs text-slate-500 mb-5">Suggested for this urgency tier: <strong class="text-slate-300">${tier.suggested}%</strong></p>

    <div class="glass rounded-xl p-4 mb-5 flex items-center justify-between border border-emerald-500/20">
      <span class="text-sm text-slate-400">New price</span>
      <span id="newPrice" class="text-xl font-extrabold text-emerald-400">₹${(it.basePrice * (1 - tier.suggested / 100)).toFixed(2)}</span>
    </div>

    <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Manager note <span class="text-slate-600 normal-case font-normal">(required)</span></label>
    <textarea id="managerNote" rows="3" placeholder="e.g. Slight bruising on outer packaging, batch nearing sell-by..."
      class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
    <p id="noteError" class="hidden text-xs text-red-400 mt-1.5"><i class="fa-solid fa-circle-exclamation"></i> Please add a short note before approving.</p>

    <div class="flex gap-3 mt-6">
      <button onclick="closeApprovalDrawer()" class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors text-sm">Cancel</button>
      <button onclick="confirmApproval()" class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,.4)] text-sm flex items-center justify-center gap-2">
        <i class="fa-solid fa-check"></i> Confirm Markdown
      </button>
    </div>
  `;

  // live update slider value
  const slider = document.getElementById('markdownSlider');
  slider.addEventListener('input', () => {
    const val = slider.value;
    document.getElementById('markdownValue').textContent = val + '%';
    document.getElementById('newPrice').textContent = '₹' + (it.basePrice * (1 - val / 100)).toFixed(2);
  });

  document.getElementById('approvalOverlay').classList.add('open');
  document.getElementById('approvalDrawer').classList.add('open');
}

function closeApprovalDrawer() {
  document.getElementById('approvalOverlay').classList.remove('open');
  document.getElementById('approvalDrawer').classList.remove('open');
  currentItemId = null;
}

// client-side validation logic
function confirmApproval() {
  const note = document.getElementById('managerNote');
  const noteError = document.getElementById('noteError');

  // physically block submission if input is too short
  if (note.value.trim().length < 5) {
    note.classList.add('field-error', 'shake');
    noteError.classList.remove('hidden');
    setTimeout(() => note.classList.remove('shake'), 350);
    note.focus();
    return;
  }
  
  note.classList.remove('field-error');
  noteError.classList.add('hidden');

  const it = inventory.find(x => x.id === currentItemId);
  const slider = document.getElementById('markdownSlider');
  const pct = parseInt(slider.value);

  it.status = 'approved';
  it.markdown = pct;

  approvedTotal++;
  valueProtected += Math.round(it.basePrice * (pct / 100) * it.qty);

  closeApprovalDrawer();
  renderInventory();
  showWorkflowToast(`${it.name} marked down ${pct}% — synced to storefront.`);

  // sync Exercise-3 scroll event stats
  const evApproved = document.getElementById('evScrollApproved');
  const evPending  = document.getElementById('evScrollPending');
  if (evApproved) evApproved.textContent = approvedTotal;
  if (evPending)  evPending.textContent  = inventory.filter(i => i.status === 'pending').length;

  // send native desktop notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Markdown Approved ✅', { body: `${it.name} now ₹${(it.basePrice * (1 - pct / 100)).toFixed(2)} (${pct}% off)` });
  }
}

// trigger UI toast
function showWorkflowToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// initialize on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('inventoryList')) {
    renderInventory();
    initFilterButtons();
  }
});