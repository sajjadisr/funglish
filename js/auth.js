// js/auth.js
(function() {
  const STORAGE_KEY = 'funglish_user';

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function clearUser() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return '?';
    const parts = String(nameOrEmail).trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function updateHeaderUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    if (!loginBtn && !userMenu) return; // page without auth controls

    const isLoggedIn = !!user;
    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-flex';
    if (userMenu) userMenu.style.display = isLoggedIn ? 'inline-flex' : 'none';

    if (isLoggedIn) {
      const displayName = user.name && user.name.trim() ? user.name : (user.email || 'کاربر');
      if (userName) userName.textContent = displayName;
      if (userAvatar) userAvatar.textContent = getInitials(displayName);
      if (logoutBtn) {
        logoutBtn.onclick = function() {
          Auth.signOut();
        };
      }
    }
  }

  function openModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    const nameInput = document.getElementById('auth-name');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  const listeners = new Set();
  function emitChange(user) {
    listeners.forEach(fn => {
      try { fn(user); } catch (_) {}
    });
  }

  const Auth = {
    getUser() {
      return getStoredUser();
    },
    onChange(callback) {
      if (typeof callback === 'function') listeners.add(callback);
      return () => listeners.delete(callback);
    },
    signIn({ name, email }) {
      const user = {
        id: 'local-' + Math.random().toString(36).slice(2),
        name: (name || '').trim(),
        email: (email || '').trim(),
        createdAt: new Date().toISOString()
      };
      saveUser(user);
      updateHeaderUI(user);
      emitChange(user);
      closeModal();
      return user;
    },
    signOut() {
      clearUser();
      updateHeaderUI(null);
      emitChange(null);
    }
  };

  // Expose globally for simple usage across pages
  window.Auth = Auth;

  document.addEventListener('DOMContentLoaded', function() {
    // Wire up header buttons
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const modal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('auth-close');
    const form = document.getElementById('auth-form');

    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        openModal();
      });
    }
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        closeModal();
      });
    }
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('auth-name');
        const emailInput = document.getElementById('auth-email');
        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        if (!name || !email) return;
        Auth.signIn({ name, email });
      });
    }

    // Initial UI state
    updateHeaderUI(getStoredUser());
  });
})();