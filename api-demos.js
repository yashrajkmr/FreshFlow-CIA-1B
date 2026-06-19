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