/**
 * PetHub — Cart Module
 * LocalStorage-backed shopping cart with UI management
 */

const Cart = {
  STORAGE_KEY: 'pethub_cart',

  /**
   * Get current cart items
   */
  getItems() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  /**
   * Save cart items to LocalStorage
   */
  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateBadge();
    this.renderDrawer();
  },

  /**
   * Add product to cart
   */
  addItem(product, qty = 1) {
    const items = this.getItems();
    const existing = items.find(item => item.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty
      });
    }

    this.save(items);
    showToast(`${product.name} added to cart!`, 'success');
  },

  /**
   * Remove product from cart
   */
  removeItem(id) {
    const items = this.getItems().filter(item => item.id !== id);
    this.save(items);
    showToast('Item removed from cart', 'info');
  },

  /**
   * Update item quantity
   */
  updateQty(id, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    item.qty = qty;
    this.save(items);
  },

  /**
   * Get total item count
   */
  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.qty, 0);
  },

  /**
   * Get total price
   */
  getTotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.qty), 0);
  },

  /**
   * Clear entire cart
   */
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
    this.renderDrawer();
  },

  /**
   * Update cart badge in navbar
   */
  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;

    const count = this.getCount();
    badge.textContent = count;
    
    if (count > 0) {
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  },

  /**
   * Toggle cart drawer
   */
  toggleDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-overlay');
    if (!drawer) return;

    drawer.classList.toggle('open');
    if (overlay) {
      overlay.classList.toggle('active');
    }
  },

  /**
   * Render cart drawer contents
   */
  renderDrawer() {
    const body = document.querySelector('.cart-drawer-body');
    const footer = document.querySelector('.cart-drawer-footer');
    if (!body) return;

    const items = this.getItems();

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h4>Your cart is empty</h4>
          <p style="color: var(--text-muted); margin-top: 8px;">Browse our shop and add some items!</p>
        </div>
      `;
      if (footer) {
        footer.innerHTML = '';
      }
      return;
    }

    body.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">
            <button onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem(${item.id})" title="Remove">✕</button>
      </div>
    `).join('');

    if (footer) {
      footer.innerHTML = `
        <div class="cart-total">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value">$${this.getTotal().toFixed(2)}</span>
        </div>
        <button class="btn btn-primary w-full" onclick="showToast('Checkout coming soon!', 'info')">
          🛍️ Checkout
        </button>
        <button class="btn btn-secondary w-full" onclick="Cart.clear(); showToast('Cart cleared', 'info')" style="margin-top: 8px;">
          Clear Cart
        </button>
      `;
    }
  },

  /**
   * Initialize cart on page load
   */
  init() {
    this.updateBadge();
    this.renderDrawer();

    // Close drawer when clicking overlay
    const overlay = document.querySelector('.cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.toggleDrawer());
    }
  }
};

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});
