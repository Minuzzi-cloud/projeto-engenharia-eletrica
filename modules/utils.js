/*************************************************
 * MÓDULO: UTILS (Utilidades)
 * Responsabilidade: Funções auxiliares genéricas
 *************************************************/

const Utils = (() => {
  return {
    // DOM
    $ : (id) => document.getElementById(id),

    on: (selector, event, callback) => {
      const element = typeof selector === "string" 
        ? document.querySelector(selector)
        : selector;
      
      if (element) {
        element.addEventListener(event, callback);
      }
    },

    onAll: (selector, event, callback) => {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener(event, callback);
      });
    },

    onDelegate: (selector, event, callback, useCapture = false) => {
      document.addEventListener(event, (e) => {
        if (e.target.closest(selector)) {
          callback(e);
        }
      }, useCapture);
    },

    addClass: (el, className) => el?.classList.add(className),

    removeClass: (el, className) => el?.classList.remove(className),

    toggleClass: (el, className) => el?.classList.toggle(className),

    hasClass: (el, className) => el?.classList.contains(className),

    setAttributes: (el, attrs) => {
      Object.keys(attrs).forEach(key => {
        el.setAttribute(key, attrs[key]);
      });
    },

    // String
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

    // Storage
    setStorage: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },

    getStorage: (key) => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },

    removeStorage: (key) => {
      localStorage.removeItem(key);
    },

    // Delay
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
  };
})();
