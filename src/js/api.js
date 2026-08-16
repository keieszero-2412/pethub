/**
 * PetHub — API Utility Module
 * Shared fetch helpers for all pages
 */

const API = {
  // Base paths — works with both local dev and Vercel
  BASE_URL: '',
  DATA_PATH: '/public/data',

  /**
   * Determine the correct base path depending on environment
   */
  getBasePath() {
    const loc = window.location;
    // If served from src/pages/, go up two levels to project root
    if (loc.pathname.includes('/src/pages/')) {
      return '../..';
    }
    return '.';
  },

  /**
   * Fetch products from JSON
   */
  async fetchProducts(category = null, search = null) {
    try {
      const basePath = this.getBasePath();
      const res = await fetch(`${basePath}/public/data/products.json`);
      if (!res.ok) throw new Error('Failed to load products');
      let products = await res.json();

      if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return products;
    } catch (err) {
      console.error('API.fetchProducts:', err);
      showToast('Failed to load products', 'error');
      return [];
    }
  },

  /**
   * Fetch rescue pets from JSON
   */
  async fetchPets(type = null, status = null) {
    try {
      const basePath = this.getBasePath();
      const res = await fetch(`${basePath}/public/data/pets.json`);
      if (!res.ok) throw new Error('Failed to load pets');
      let pets = await res.json();

      if (type && type !== 'all') {
        pets = pets.filter(p => p.type === type);
      }
      if (status && status !== 'all') {
        pets = pets.filter(p => p.status === status);
      }
      return pets;
    } catch (err) {
      console.error('API.fetchPets:', err);
      showToast('Failed to load pets', 'error');
      return [];
    }
  },

  /**
   * Submit booking (saves to SessionStorage for demo)
   */
  async submitBooking(data) {
    try {
      // In production with Vercel, this would POST to /api/booking
      // For static demo, we save to SessionStorage
      const bookings = JSON.parse(sessionStorage.getItem('pethub_bookings') || '[]');
      const booking = {
        id: 'BK-' + Date.now().toString(36).toUpperCase(),
        ...data,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };
      bookings.push(booking);
      sessionStorage.setItem('pethub_bookings', JSON.stringify(bookings));
      return { success: true, booking };
    } catch (err) {
      console.error('API.submitBooking:', err);
      showToast('Failed to submit booking', 'error');
      return { success: false, error: err.message };
    }
  },

  /**
   * Get booking history from SessionStorage
   */
  getBookings() {
    return JSON.parse(sessionStorage.getItem('pethub_bookings') || '[]');
  },

  /**
   * Health Records CRUD (LocalStorage-backed)
   */
  healthRecords: {
    STORAGE_KEY: 'pethub_health_records',

    getAll() {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },

    getById(id) {
      const records = this.getAll();
      return records.find(r => r.id === id);
    },

    create(data) {
      const records = this.getAll();
      const record = {
        id: 'HR-' + Date.now().toString(36).toUpperCase(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      records.push(record);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
      return record;
    },

    update(id, data) {
      const records = this.getAll();
      const index = records.findIndex(r => r.id === id);
      if (index === -1) return null;
      records[index] = { ...records[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
      return records[index];
    },

    delete(id) {
      const records = this.getAll();
      const filtered = records.filter(r => r.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return filtered.length < records.length;
    }
  }
};

/* ========================================
   Toast Notification System
   ======================================== */
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ========================================
   Theme Toggle
   ======================================== */
function initTheme() {
  const saved = localStorage.getItem('pethub_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Update toggle button icon
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('pethub_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('pethub_theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️' : '🌙';
}

/* ========================================
   Navbar Scroll Effect
   ======================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ========================================
   Mobile Menu Toggle
   ======================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.navbar-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ========================================
   Scroll Reveal Animation
   ======================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ========================================
   Initialize Common Features
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
});
