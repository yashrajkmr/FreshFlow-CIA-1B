// HTML5 APIs integration for Lab 2

// intersection observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  checkLogin();
  drawCanvasChart();
});

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// API 1: Local Storage
function checkLogin() {
  const user = localStorage.getItem('freshflow_user');
  if (user) document.getElementById('loginBtn').innerText = 'Welcome, ' + user;
}
function handleLogin() {
  const name = prompt('Enter your name to access dashboard:');
  if (name && name.trim()) {
    localStorage.setItem('freshflow_user', name.trim());
    checkLogin();
  }
}

// API 2: Geolocation
function getLocation() {
  const el = document.getElementById('locText');
  el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
  if (!navigator.geolocation) {
    el.innerText = 'Geolocation not supported.';
    el.className = 'text-xs text-red-400 mt-3 h-4';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      el.innerHTML = `<i class="fa-solid fa-check mr-1"></i> Found near Lat: ${pos.coords.latitude.toFixed(3)}, Lon: ${pos.coords.longitude.toFixed(3)}`;
      el.className = 'text-xs text-emerald-400 mt-3 h-4 font-medium';
    },
    () => {
      el.innerText = 'Location access denied.';
      el.className = 'text-xs text-red-400 mt-3 h-4';
    }
  );
}

// API 3: Web Notifications
function enableNotifications() {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.');
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      new Notification('FreshFlow Alerts', { body: 'Flash sales alerts enabled!' });
    } else {
      alert('Please allow notifications in your browser settings.');
    }
  });
}

// API 4: Clipboard
function copyKey() {
  const key = document.getElementById('apiCode').innerText;
  navigator.clipboard.writeText(key).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    btn.classList.add('border-emerald-500', 'text-emerald-400');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
      btn.classList.remove('border-emerald-500', 'text-emerald-400');
    }, 2000);
  });
}

// API 5: Canvas (Line Graph)
function drawCanvasChart() {
  const canvas = document.getElementById('decayCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw graph axes
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(30, 170);
  ctx.lineTo(380, 170);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.stroke();

  // draw the decay curve line
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.quadraticCurveTo(200, 40, 380, 160);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.stroke();

  // render labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('Price', 5, 20);
  ctx.fillText('Time to Expiry', 300, 190);
}

// API 6: Drag & Drop
function handleDragOver(e) {
  e.preventDefault();
  const zone = document.getElementById('dropZone');
  zone.classList.add('dragover');
  zone.querySelector('i').classList.replace('text-slate-500', 'text-emerald-400');
}
function handleDragLeave(e) {
  e.preventDefault();
  const zone = document.getElementById('dropZone');
  zone.classList.remove('dragover');
  zone.querySelector('i').classList.replace('text-emerald-400', 'text-slate-500');
}
function handleDrop(e) {
  e.preventDefault();
  const zone = document.getElementById('dropZone');
  zone.classList.remove('dragover');

  // get file and update DOM string
  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    document.getElementById('dropContent').innerHTML = `
      <i class="fa-solid fa-circle-check text-4xl text-emerald-400 mb-4"></i>
      <p class="text-white font-medium text-center">✓ Processed: <br><span class="text-emerald-400 text-sm font-normal">${file.name}</span></p>
    `;
  }
}

// ─────────────────────────────────────────────
// EXERCISE-3: Event Handling Demonstrations
// ─────────────────────────────────────────────

// EVENT 1: input — Live product search + character count
function handleSearchInput(input) {
  const query = input.value.trim().toLowerCase();
  const count = input.value.length;

  // update char count display
  document.getElementById('charCount').textContent = count + ' char' + (count !== 1 ? 's' : '');

  // filter the markdown-approval inventory list if it exists
  const rows = document.querySelectorAll('#inventoryList > div');
  let matched = 0;
  rows.forEach(row => {
    const name = row.querySelector('h4') ? row.querySelector('h4').textContent.toLowerCase() : '';
    const visible = !query || name.includes(query);
    row.style.display = visible ? '' : 'none';
    if (visible) matched++;
  });

  const feedback = document.getElementById('searchFeedback');
  if (!query) {
    feedback.textContent = 'Start typing to filter inventory…';
    feedback.className = 'text-xs text-slate-500';
  } else {
    feedback.textContent = matched + ' item' + (matched !== 1 ? 's' : '') + ' matched for "' + input.value.trim() + '"';
    feedback.className = matched > 0 ? 'text-xs text-emerald-400' : 'text-xs text-red-400';
  }
}

// EVENT 2: focus / blur — Manager note field glow
function handleFocusEvent(el) {
  el.style.borderColor = '#10b981';
  el.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.2)';
  const fb = document.getElementById('focusFeedback');
  fb.textContent = '✏️ Field active — focus event fired. Add your markdown justification.';
  fb.className = 'text-xs text-emerald-400 mt-2 h-4';
}
function handleBlurEvent(el) {
  el.style.borderColor = '';
  el.style.boxShadow = '';
  const fb = document.getElementById('focusFeedback');
  const hasText = el.value.trim().length > 0;
  fb.textContent = hasText ? '✓ Note saved — blur event fired.' : 'Field inactive — blur event fired.';
  fb.className = hasText ? 'text-xs text-cyan-400 mt-2 h-4' : 'text-xs text-slate-500 mt-2 h-4';
}

// EVENT 3: mouseover / mouseout — Hover price preview
function handleMouseover(card) {
  const base = parseFloat(card.dataset.base);
  const pct  = parseFloat(card.dataset.pct);
  const discounted = (base * (1 - pct / 100)).toFixed(2);

  card.querySelector('.item-base-price').classList.add('hidden');
  const hoverEl = card.querySelector('.item-hover-price');
  hoverEl.textContent = '₹' + discounted + ' (' + pct + '% off)';
  hoverEl.classList.remove('hidden');

  card.style.borderColor = 'rgba(16,185,129,0.45)';
  card.style.boxShadow = '0 8px 24px -8px rgba(16,185,129,0.3)';
  card.style.transform = 'translateY(-3px)';
}
function handleMouseout(card) {
  card.querySelector('.item-base-price').classList.remove('hidden');
  card.querySelector('.item-hover-price').classList.add('hidden');

  card.style.borderColor = '';
  card.style.boxShadow = '';
  card.style.transform = '';
}

// EVENT 4: keydown — Manager keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const fb = document.getElementById('keydownFeedback');
  if (!fb) return;

  // Alt+W → jump to approval console
  if (e.altKey && e.key.toLowerCase() === 'w') {
    e.preventDefault();
    document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
    fb.innerHTML = '<i class="fa-solid fa-arrow-down text-emerald-400"></i> <span class="text-emerald-400">Alt+W fired — jumped to Approval Console.</span>';
    setTimeout(() => resetKeyFeedback(fb), 3000);
  }
  // Esc → clear search
  else if (e.key === 'Escape') {
    const si = document.getElementById('searchInput');
    if (si) { si.value = ''; handleSearchInput(si); }
    fb.innerHTML = '<i class="fa-solid fa-xmark text-amber-400"></i> <span class="text-amber-400">Esc fired — search cleared.</span>';
    setTimeout(() => resetKeyFeedback(fb), 3000);
  }
  // Alt+S → focus search bar
  else if (e.altKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
    fb.innerHTML = '<i class="fa-solid fa-magnifying-glass text-cyan-400"></i> <span class="text-cyan-400">Alt+S fired — search bar focused.</span>';
    setTimeout(() => resetKeyFeedback(fb), 3000);
  }
});

function resetKeyFeedback(el) {
  el.innerHTML = '<i class="fa-solid fa-keyboard text-slate-600"></i> <span>Press a shortcut to see the keydown event fire…</span>';
}

// EVENT 5: scroll — progress bar + scroll stats
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

  // update sticky progress bar
  const bar = document.getElementById('scrollProgress');
  if (bar) bar.style.width = pct + '%';

  // update scroll event demo stats
  const evPct = document.getElementById('evScrollPct');
  if (evPct) evPct.textContent = pct + '%';
});