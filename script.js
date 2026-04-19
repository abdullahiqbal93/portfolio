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
const SETTINGS_KEY = 'portfolio_settings';
const DEFAULT_SETTINGS = {
  gridCols: 4,
  iconSize: 64,
  gridGap: 14
};

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings(settings) {
  let gap = settings.gridGap;
  if (settings.gridCols === 5 && gap > 10) {
    gap = 10;
  }

  let iconSize = settings.iconSize;
  if (settings.gridCols === 5 && iconSize > 56) {
    iconSize = 56;
  }

  document.documentElement.style.setProperty('--grid-cols', settings.gridCols);
  document.documentElement.style.setProperty('--icon-size', iconSize + 'px');
  document.documentElement.style.setProperty('--grid-gap', gap + 'px');
  updateSettingsUI(settings);
}

function updateSettingsUI(settings) {
  document.querySelectorAll('.grid-preset-btn').forEach(btn => {
    btn.classList.remove('active');
    const cols = parseInt(btn.textContent);
    if (cols === settings.gridCols) btn.classList.add('active');
  });
  document.getElementById('iconSizeSlider').value = settings.iconSize;
  document.getElementById('iconSizeValue').textContent = settings.iconSize;
  document.getElementById('gridSpacingSlider').value = settings.gridGap;
  document.getElementById('gridSpacingValue').textContent = settings.gridGap;
}

function setGridSize(cols) {
  const settings = loadSettings();
  settings.gridCols = cols;
  saveSettings(settings);
  applySettings(settings);
  reinitializeGrid();
}

function setIconSize(size) {
  const settings = loadSettings();
  settings.iconSize = parseInt(size);
  saveSettings(settings);
  applySettings(settings);

  document.getElementById('iconSizeValue').textContent = size;
}

function setGridSpacing(spacing) {
  const settings = loadSettings();
  settings.gridGap = parseInt(spacing);
  saveSettings(settings);
  applySettings(settings);

  document.getElementById('gridSpacingValue').textContent = spacing;
}

function resetSettings() {
  if (confirm('Reset all settings to default?')) {
    saveSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    reinitializeGrid();
  }
}

function reinitializeGrid() {
  const settings = loadSettings();
  const cols = settings.gridCols;
  const rows = 4;
  const newTotalCells = cols * rows;
  const positions = loadIconPositions();
  const iconGrid = document.getElementById('iconGrid');
  const currentIcons = Array.from(iconGrid.querySelectorAll('.app-icon'));
  iconGrid.innerHTML = '';
  for (let i = 0; i < newTotalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.cellIndex = i;
    cell.addEventListener('dragover', handleCellDragOver);
    cell.addEventListener('drop', handleCellDrop);
    cell.addEventListener('dragenter', handleCellDragEnter);
    cell.addEventListener('dragleave', handleCellDragLeave);
    iconGrid.appendChild(cell);
  }
  currentIcons.forEach(icon => {
    const appId = icon.dataset.appId;
    let cellIndex = positions[appId] !== undefined ? positions[appId] : null;
    if (cellIndex === null || cellIndex >= newTotalCells) {
      const emptyCells = Array.from(iconGrid.querySelectorAll('.grid-cell')).filter(c => c.children.length === 0);
      if (emptyCells.length > 0) {
        cellIndex = parseInt(emptyCells[0].dataset.cellIndex);
      }
    }

    if (cellIndex !== null) {
      const cell = iconGrid.querySelector(`[data-cell-index="${cellIndex}"]`);
      if (cell && cell.children.length === 0) {
        cell.appendChild(icon);
      }
    }
  });
  initIconDragAndDrop();
}

document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();
  applySettings(settings);
  initializeGrid();
  restoreIconPositions();
  initIconDragAndDrop();
});
let draggedIcon = null;
let draggedFromCell = null;
const iconGrid = document.getElementById('iconGrid');
const STORAGE_KEY = 'portfolio_icon_positions';
const GRID_COLS = 4;
const GRID_ROWS = 5;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
let iconElements = [];

function initializeGrid() {
  iconElements = Array.from(iconGrid.querySelectorAll('.app-icon'));
  iconGrid.innerHTML = '';
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.cellIndex = i;
    cell.addEventListener('dragover', handleCellDragOver);
    cell.addEventListener('drop', handleCellDrop);
    cell.addEventListener('dragenter', handleCellDragEnter);
    cell.addEventListener('dragleave', handleCellDragLeave);
    iconGrid.appendChild(cell);
  }
}

function loadIconPositions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveIconPositions() {
  const positions = {};
  document.querySelectorAll('.app-icon').forEach(icon => {
    const appId = icon.dataset.appId;
    const cell = icon.parentElement;
    if (cell && cell.dataset.cellIndex !== undefined) {
      positions[appId] = parseInt(cell.dataset.cellIndex);
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function restoreIconPositions() {
  const positions = loadIconPositions();
  const usedCells = new Set();
  iconElements.forEach(icon => {
    const appId = icon.dataset.appId;
    if (positions[appId] !== undefined) {
      const cellIndex = positions[appId];
      if (cellIndex < TOTAL_CELLS) {
        const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
        if (cell && cell.children.length === 0) {
          cell.appendChild(icon);
          usedCells.add(cellIndex);
        }
      }
    }
  });
  iconElements.forEach(icon => {
    if (!icon.parentElement || icon.parentElement.id === 'iconGrid') {
      for (let i = 0; i < TOTAL_CELLS; i++) {
        if (!usedCells.has(i)) {
          const cell = document.querySelector(`[data-cell-index="${i}"]`);
          if (cell && cell.children.length === 0) {
            cell.appendChild(icon);
            usedCells.add(i);
            break;
          }
        }
      }
    }
  });
}

function handleDragStart(e) {
  draggedIcon = this;
  draggedFromCell = this.parentElement;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  if (draggedIcon) {
    draggedIcon.classList.remove('dragging');
  }
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.remove('drag-over');
  });
  draggedIcon = null;
  draggedFromCell = null;
}

function handleCellDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleCellDragEnter(e) {
  if (draggedIcon) {
    this.classList.add('drag-over');
  }
}

function handleCellDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleCellDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  if (draggedIcon && this.children.length === 0) {
    this.appendChild(draggedIcon);
    saveIconPositions();
  } else if (draggedIcon && this.children.length > 0) {
    const targetIcon = this.children[0];
    if (draggedFromCell) {
      draggedFromCell.appendChild(targetIcon);
    }
    this.appendChild(draggedIcon);
    saveIconPositions();
  }

  this.classList.remove('drag-over');
  return false;
}

function initIconDragAndDrop() {
  const icons = document.querySelectorAll('.app-icon');
  icons.forEach(icon => {
    icon.addEventListener('dragstart', handleDragStart);
    icon.addEventListener('dragend', handleDragEnd);
  });
}