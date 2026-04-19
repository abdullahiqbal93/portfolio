function tick() {
  const n = new Date();
  const h = String(n.getHours()).padStart(2, '0');
  const m = String(n.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m;
}
tick();
setInterval(tick, 1000);

(function () {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('homeDate').textContent =
    days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
})();

function openApp(id) {
  const el = document.getElementById('app-' + id);
  if (el) {
    el.classList.add('open');
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

function closeApp(id) {
  const el = document.getElementById('app-' + id);
  if (el) el.classList.remove('open');
}

document.querySelectorAll('.app-screen').forEach(app => {
  let sy = 0, dragging = false;

  app.addEventListener('touchstart', e => {
    sy = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  app.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dy = e.touches[0].clientY - sy;
    const body = app.querySelector('.a-body');
    if (dy > 0 && body && body.scrollTop === 0) {
      app.style.transform = `translateY(${Math.min(dy * 0.45, 180)}px)`;
      app.style.transition = 'none';
    }
  }, { passive: true });

  app.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const dy = e.changedTouches[0].clientY - sy;
    app.style.transition = '';
    if (dy > 110) {
      app.classList.remove('open');
    }
    app.style.transform = '';
  });
});

function sendViaWhatsApp() {
  const name = document.getElementById('f-name').value.trim();
  const msg = document.getElementById('f-msg').value.trim();
  const btn = document.querySelector('.send-btn');

  if (!name || !msg) {
    btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Fill all fields';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
      btn.style.background = '';
    }, 2500);
    return;
  }

  const whatsappMessage = `Hello! My name is ${name}. ${msg}`;
  const phoneNumber = '94779445929';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  btn.innerHTML = '<i class="fas fa-check"></i> Redirecting...';
  btn.style.background = 'linear-gradient(135deg, #34d399, #065f46)';

  document.getElementById('f-name').value = '';
  document.getElementById('f-msg').value = '';

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
    btn.style.background = '';
  }, 1000);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.app-screen.open').forEach(a => a.classList.remove('open'));
  }
});