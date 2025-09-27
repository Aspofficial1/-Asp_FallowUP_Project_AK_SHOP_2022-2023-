'use strict';

// DOM elements
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');

// Initialize contact page
function initContact() {
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  contactForm.addEventListener('submit', handleContactSubmit);
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);
}

// Handle contact form submission
function handleContactSubmit(e) {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const submission = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    date: new Date().toISOString()
  };

  // Store submission in localStorage (mock backend)
  const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
  submissions.push(submission);
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

  // Clear form
  contactForm.reset();
  showNotification('Thank you for your message! We will respond within 24 hours.');
}

// Handle newsletter subscription
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;

  // Store email in localStorage (mock backend)
  const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
  if (subscribers.includes(email)) {
    showNotification('You are already subscribed!');
  } else {
    subscribers.push(email);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    newsletterForm.reset();
    showNotification('Thank you for subscribing! Check your email for a 10% off coupon.');
  }
}

// Notification function
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
document.addEventListener('DOMContentLoaded', initContact);