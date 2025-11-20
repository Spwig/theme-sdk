/**
 * Starter Theme JavaScript
 *
 * This file contains the main JavaScript for the starter theme.
 * Add your custom functionality here.
 */

(function() {
  'use strict';

  // Storage key for theme preference
  const THEME_STORAGE_KEY = 'spwig-theme-preference';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initProductGallery();
    initQuantitySelectors();
    initMobileMenu();
  });

  /**
   * Initialize dark mode theme toggle
   */
  function initThemeToggle() {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');

    if (!toggleButtons.length) return;

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    // Apply saved theme on page load (before paint)
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Set up toggle buttons
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        toggleTheme();
      });
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      // Only update if user hasn't set a manual preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        updateToggleLabel(e.matches ? 'dark' : 'light');
      }
    });

    // Set initial label
    updateToggleLabel(getCurrentTheme());
  }

  /**
   * Get current theme (considering system preference)
   */
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply the new theme
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save preference
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Update button labels
    updateToggleLabel(newTheme);

    // Dispatch custom event for other components to listen to
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: newTheme }
    }));
  }

  /**
   * Update toggle button accessibility labels
   */
  function updateToggleLabel(theme) {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(button => {
      const label = theme === 'dark'
        ? 'Switch to light mode'
        : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
    });
  }

  /**
   * Set theme programmatically
   */
  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Invalid theme:', theme);
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateToggleLabel(theme);

    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: theme }
    }));
  }

  /**
   * Clear saved theme preference (use system default)
   */
  function clearThemePreference() {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    updateToggleLabel(systemTheme);

    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: systemTheme }
    }));
  }

  /**
   * Initialize product gallery image switching
   */
  function initProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    if (!mainImage || !thumbnails.length) return;

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const newSrc = this.dataset.image;
        if (newSrc) {
          mainImage.src = newSrc;

          // Update active state
          thumbnails.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });
  }

  /**
   * Initialize quantity selector buttons
   */
  function initQuantitySelectors() {
    const quantityInputs = document.querySelectorAll('input[name="quantity"]');

    quantityInputs.forEach(input => {
      // Add increment/decrement buttons if needed
      // This is a basic implementation - enhance as needed
      input.addEventListener('change', function() {
        if (this.value < 1) {
          this.value = 1;
        }
      });
    });
  }

  /**
   * Initialize mobile menu toggle
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
      const isOpen = mobileNav.classList.toggle('is-open');
      this.setAttribute('aria-expanded', isOpen);
      this.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!menuToggle.contains(event.target) && !mobileNav.contains(event.target)) {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /**
   * Helper function to get CSRF token
   */
  function getCsrfToken() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  }

  // Expose helper functions if needed
  window.StarterTheme = {
    getCsrfToken: getCsrfToken,
    getCurrentTheme: getCurrentTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    clearThemePreference: clearThemePreference
  };

})();

/**
 * Early theme initialization to prevent flash of wrong theme
 * This runs immediately before DOM is ready
 */
(function() {
  const THEME_STORAGE_KEY = 'spwig-theme-preference';
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
})();
