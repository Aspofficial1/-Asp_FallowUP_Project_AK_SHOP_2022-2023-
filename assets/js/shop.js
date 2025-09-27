// Enhanced Shop JavaScript with full functionality
class ShopManager {
  constructor() {
    this.products = [
      {
        id: 1,
        name: "Varsi Leather Bag",
        category: "accessories",
        priceUSD: 48.75,
        originalPriceUSD: 65.00,
        image: "./assets/images/product-1.jpg",
        badge: { type: "discount", text: "-25%" },
        inStock: true
      },
      {
        id: 2,
        name: "Fit Twill Shirt for Woman",
        category: "women",
        priceUSD: 62.00,
        image: "./assets/images/product-2.jpg",
        badge: { type: "new", text: "New" },
        inStock: true
      },
      {
        id: 3,
        name: "Grand Atlantic Chukka Boots",
        category: "footwear",
        priceUSD: 32.00,
        image: "./assets/images/product-3.jpg",
        inStock: true
      },
      {
        id: 4,
        name: "Women's Faux-Trim Shirt",
        category: "women",
        priceUSD: 84.00,
        image: "./assets/images/product-4.jpg",
        inStock: true
      },
      {
        id: 5,
        name: "Soft Touch Interlock Polo",
        category: "men",
        priceUSD: 45.00,
        image: "./assets/images/product-5.jpg",
        inStock: true
      },
      {
        id: 6,
        name: "The Ak Shop Smart Watch",
        category: "accessories",
        priceUSD: 30.00,
        originalPriceUSD: 38.00,
        image: "./assets/images/product-6.jpg",
        inStock: true
      },
      {
        id: 7,
        name: "The Ak Shop Smart Glass",
        category: "accessories",
        priceUSD: 25.00,
        originalPriceUSD: 39.00,
        image: "./assets/images/product-7.jpg",
        inStock: true
      },
      {
        id: 8,
        name: "Cotton Shirt for Men",
        category: "men",
        priceUSD: 85.00,
        originalPriceUSD: 99.00,
        image: "./assets/images/product-8.jpg",
        inStock: true
      },
      {
        id: 9,
        name: "Double-breasted Blazer",
        category: "men",
        priceUSD: 32.00,
        image: "./assets/images/product-9.jpg",
        inStock: true
      },
      {
        id: 10,
        name: "Ribbed Cotton Bodysuits",
        category: "women",
        priceUSD: 71.00,
        image: "./assets/images/product-10.jpg",
        badge: { type: "new", text: "New" },
        inStock: true
      }
    ];
    
    this.cart = JSON.parse(localStorage.getItem('shopCart')) || [];
    this.wishlist = JSON.parse(localStorage.getItem('shopWishlist')) || [];
    this.currentCurrency = localStorage.getItem('preferredCurrency') || 'USD';
    this.exchangeRate = 303; // USD to LKR rate
    this.filteredProducts = [...this.products];
    this.currentSort = 'default';
    this.currentFilters = {
      categories: [],
      minPrice: null,
      maxPrice: null,
      searchQuery: ''
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderProducts();
    this.updateCartUI();
    this.updateWishlistUI();
    this.initDarkMode();
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.searchQuery = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.applyFilters();
      });
    }

    // Category filters
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateCategoryFilters();
      });
    });

    // Price filters
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        this.updatePriceFilters();
      });
    }

    // Currency selector
    const currencySelect = document.querySelector('.currency-select');
    if (currencySelect) {
      currencySelect.value = this.currentCurrency;
      currencySelect.addEventListener('change', (e) => {
        this.currentCurrency = e.target.value;
        localStorage.setItem('preferredCurrency', this.currentCurrency);
        this.renderProducts();
        this.updateCartUI();
      });
    }

    // Sort options
    document.querySelectorAll('.sort-radio').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applySort();
      });
    });

    // Cart functionality
    const cartBtn = document.querySelector('[aria-label="Cart"]');
    const closeCartBtn = document.querySelector('#close-cart-btn');
    const cartOverlay = document.querySelector('#cart-overlay');
    
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCart());
    }
    
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => this.closeCart());
    }
    
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Dark mode toggle
    const darkModeBtn = document.querySelector('#dark-mode-toggle');
    if (darkModeBtn) {
      darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
    }

    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        // In a real app, this would load more products from an API
        this.showLoadingState();
        setTimeout(() => {
          this.hideLoadingState();
          this.showNotification('No more products to load');
        }, 1000);
      });
    }
  }

  updateCategoryFilters() {
    const checkedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
      .map(checkbox => checkbox.value);
    this.currentFilters.categories = checkedCategories;
    this.applyFilters();
  }

  updatePriceFilters() {
    const minPrice = document.querySelector('[name="min-price"]').value;
    const maxPrice = document.querySelector('[name="max-price"]').value;
    
    this.currentFilters.minPrice = minPrice ? parseFloat(minPrice) : null;
    this.currentFilters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
    
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Category filter
    if (this.currentFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        this.currentFilters.categories.includes(product.category)
      );
    }

    // Price filter
    if (this.currentFilters.minPrice || this.currentFilters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = this.currentCurrency === 'USD' ? product.priceUSD : product.priceUSD * this.exchangeRate;
        const min = this.currentFilters.minPrice || 0;
        const max = this.currentFilters.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    // Search filter
    if (this.currentFilters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.currentFilters.searchQuery) ||
        product.category.toLowerCase().includes(this.currentFilters.searchQuery)
      );
    }

    this.filteredProducts = filtered;
    this.applySort();
    this.updateResultCount();
  }

  applySort() {
    switch (this.currentSort) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        this.filteredProducts = this.filteredProducts.sort((a, b) => a.id - b.id);
    }
    this.renderProducts();
  }

  renderProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;

    productList.innerHTML = this.filteredProducts.map(product => {
      const isInCart = this.cart.some(item => item.id === product.id);
      const isInWishlist = this.wishlist.some(item => item.id === product.id);
      
      return `
        <li>
          <div class="product-card" data-product-id="${product.id}">
            <figure class="card-banner">
              <a href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy" width="800" height="1034" class="w-100">
              </a>
              
              ${product.badge ? `<div class="card-badge ${product.badge.type === 'new' ? 'green' : 'red'}">${product.badge.text}</div>` : ''}
              
              <div class="card-actions">
                <button class="card-action-btn quick-view-btn" aria-label="Quick view" data-product-id="${product.id}">
                  <ion-icon name="eye-outline"></ion-icon>
                </button>
                
                <button class="card-action-btn cart-btn ${isInCart ? 'added' : ''}" data-product-id="${product.id}">
                  <ion-icon name="${isInCart ? 'checkmark-outline' : 'bag-handle-outline'}" aria-hidden="true"></ion-icon>
                  <p>${isInCart ? 'Added to Cart' : 'Add to Cart'}</p>
                </button>
                
                <button class="card-action-btn wishlist-btn ${isInWishlist ? 'added' : ''}" aria-label="Add to Wishlist" data-product-id="${product.id}">
                  <ion-icon name="${isInWishlist ? 'heart' : 'heart-outline'}"></ion-icon>
                </button>
              </div>
            </figure>
            
            <div class="card-content">
              <h3 class="h4 card-title">
                <a href="product-detail.html?id=${product.id}">${product.name}</a>
              </h3>
              
              <div class="card-price">
                ${this.renderPrice(product)}
              </div>
            </div>
          </div>
        </li>
      `;
    }).join('');

    // Bind product action events
    this.bindProductActions();
  }

  renderPrice(product) {
    if (this.currentCurrency === 'USD') {
      return `
        <data value="${product.priceUSD}" class="price-usd">$${product.priceUSD.toFixed(2)}</data>
        ${product.originalPriceUSD ? `<data value="${product.originalPriceUSD}" class="price-usd-old">$${product.originalPriceUSD.toFixed(2)}</data>` : ''}
      `;
    } else {
      const priceLKR = product.priceUSD * this.exchangeRate;
      const originalPriceLKR = product.originalPriceUSD ? product.originalPriceUSD * this.exchangeRate : null;
      
      return `
        <data value="${priceLKR}" class="price-lkr">Rs. ${priceLKR.toLocaleString()}</data>
        ${originalPriceLKR ? `<data value="${originalPriceLKR}" class="price-lkr-old">Rs. ${originalPriceLKR.toLocaleString()}</data>` : ''}
      `;
    }
  }

  bindProductActions() {
    // Add to cart buttons
    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.toggleCart(productId);
      });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.toggleWishlist(productId);
      });
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        this.showQuickView(productId);
      });
    });
  }

  toggleCart(productId = null) {
    const cartSidebar = document.querySelector('#cart-sidebar');
    const cartOverlay = document.querySelector('#cart-overlay');
    
    if (productId) {
      this.addToCart(productId);
      return;
    }
    
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.toggle('active');
      cartOverlay.classList.toggle('active');
      document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
  }

  closeCart() {
    const cartSidebar = document.querySelector('#cart-sidebar');
    const cartOverlay = document.querySelector('#cart-overlay');
    
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem('shopCart', JSON.stringify(this.cart));
    this.updateCartUI();
    this.renderProducts();
    this.showNotification(`${product.name} added to cart!`);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    localStorage.setItem('shopCart', JSON.stringify(this.cart));
    this.updateCartUI();
    this.renderProducts();
  }

  updateCartQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        localStorage.setItem('shopCart', JSON.stringify(this.cart));
        this.updateCartUI();
      }
    }
  }

  updateCartUI() {
    // Update cart badge
    const cartBadge = document.querySelector('.header-action-btn .btn-badge.green');
    if (cartBadge) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalItems;
    }

    // Update cart sidebar
    const cartList = document.querySelector('.cart-list');
    const totalPriceUSD = document.querySelector('.total-price-usd');
    const totalPriceLKR = document.querySelector('.total-price-lkr');
    
    if (cartList) {
      if (this.cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
      } else {
        cartList.innerHTML = this.cart.map(item => `
          <li class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-price">${this.currentCurrency === 'USD' ? `$${item.priceUSD.toFixed(2)}` : `Rs. ${(item.priceUSD * this.exchangeRate).toLocaleString()}`}</div>
              <div class="quantity-controls">
                <button class="quantity-btn minus-btn" data-item-id="${item.id}">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-item-id="${item.id}">
                <button class="quantity-btn plus-btn" data-item-id="${item.id}">+</button>
              </div>
              <button class="remove-item" data-item-id="${item.id}">Remove</button>
            </div>
          </li>
        `).join('');
      }
    }

    // Update total prices
    const total = this.cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
    
    if (totalPriceUSD) {
      totalPriceUSD.textContent = `$${total.toFixed(2)}`;
    }
    
    if (totalPriceLKR) {
      totalPriceLKR.textContent = `Rs. ${(total * this.exchangeRate).toLocaleString()}`;
    }

    // Bind cart item events
    this.bindCartEvents();
  }

  bindCartEvents() {
    // Quantity controls
    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt(btn.dataset.itemId);
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
          this.updateCartQuantity(itemId, item.quantity - 1);
        }
      });
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt(btn.dataset.itemId);
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
          this.updateCartQuantity(itemId, item.quantity + 1);
        }
      });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', () => {
        const itemId = parseInt(input.dataset.itemId);
        const newQuantity = parseInt(input.value);
        this.updateCartQuantity(itemId, newQuantity);
      });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt(btn.dataset.itemId);
        this.removeFromCart(itemId);
      });
    });
  }

  toggleWishlist(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      this.wishlist.splice(existingIndex, 1);
      this.showNotification(`${product.name} removed from wishlist`);
    } else {
      this.wishlist.push(product);
      this.showNotification(`${product.name} added to wishlist!`);
    }

    localStorage.setItem('shopWishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
    this.renderProducts();
  }

  updateWishlistUI() {
    const wishlistBadge = document.querySelector('.header-action-btn .btn-badge:not(.green)');
    if (wishlistBadge) {
      wishlistBadge.textContent = this.wishlist.length;
    }
  }

  showQuickView(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Create and show modal (simplified version)
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="modal-body">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <div class="price">${this.renderPrice(product)}</div>
            <button class="btn btn-primary add-to-cart-modal" data-product-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('close-modal')) {
        document.body.removeChild(modal);
      }
    });

    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
      this.addToCart(productId);
      document.body.removeChild(modal);
    });
  }

  updateResultCount() {
    const countText = document.querySelector('.count-text');
    if (countText) {
      countText.textContent = `Showing ${this.filteredProducts.length} of ${this.products.length} products`;
    }
  }

  initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  }

  showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--middle-blue-green);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showLoadingState() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.disabled = true;
    }
  }

  hideLoadingState() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Load More Products';
      loadMoreBtn.disabled = false;
    }
  }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShopManager();
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .quick-view-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 20px;
    max-width: 600px;
    width: 90%;
    position: relative;
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
  }

  .modal-body img {
    width: 100%;
    border-radius: 8px;
  }

  .cart-btn.added {
    background: var(--middle-blue-green);
    color: white;
  }

  .wishlist-btn.added ion-icon {
    color: var(--candy-pink);
  }

  .empty-cart {
    text-align: center;
    padding: 40px 20px;
    color: var(--sonic-silver);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .modal-body {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
`;

document.head.appendChild(style);