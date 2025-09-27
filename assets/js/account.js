'use strict';

const EXCHANGE_RATE = 303.00; // USD to LKR exchange rate
let currentCurrency = 'USD'; // Default currency

// DOM elements
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const historyTableBody = document.getElementById('history-table-body');

// Initialize account page
function initAccount() {
  displayUserInfo();
  displayPurchaseHistory();
  setupEventListeners();
}

// Display user information
function displayUserInfo() {
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Guest User',
    email: 'guest@Ak Shop.lk'
  };
  userNameEl.textContent = user.name;
  userEmailEl.textContent = user.email;

  // Show/hide buttons based on login state
  if (user.name === 'Guest User') {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  } else {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  }
}

// Display purchase history
function displayPurchaseHistory() {
  const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
  historyTableBody.innerHTML = '';

  if (purchases.length === 0) {
    historyTableBody.innerHTML = '<tr><td colspan="5">No purchases yet.</td></tr>';
    return;
  }

  purchases.forEach(purchase => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${purchase.name}</td>
      <td>${new Date(purchase.date).toLocaleDateString()}</td>
      <td>${currentCurrency === 'USD' ? `$${purchase.price.toFixed(2)}` : `Rs. ${(purchase.price * EXCHANGE_RATE).toFixed(0)}`}</td>
      <td>${currentCurrency === 'USD' ? `Rs. ${(purchase.price * EXCHANGE_RATE).toFixed(0)}` : `$${purchase.price.toFixed(2)}`}</td>
      <td>${purchase.quantity}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

// Setup event listeners
function setupEventListeners() {
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);

  // Listen for currency changes (from shop.js)
  document.querySelector('.currency-select')?.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    displayPurchaseHistory();
  });
}

// Mock login function
function handleLogin() {
  // In a real app, this would involve authentication
  const user = {
    name: 'Abhishek Perera', // Replace with actual user input or auth
    email: 'abhishek@AKShop.lk'
  };
  localStorage.setItem('user', JSON.stringify(user));
  displayUserInfo();
  showNotification('Logged in successfully!');
}

// Logout function
function handleLogout() {
  localStorage.setItem('user', JSON.stringify({ name: 'Guest User', email: 'guest@AK Shop.lk' }));
  displayUserInfo();
  showNotification('Logged out successfully!');
}

// Notification function (reused from shop.js)
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--middle-blue-green);
    color: var(--white);
    padding: 15px 20px;
    border-radius: 6px;
    z-index: 1001;
    font-size: var(--fs-9);
    box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.15);
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initAccount);