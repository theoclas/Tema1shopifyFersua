/**
 * ALLSET JEWELRY — Theme interactions
 * Drawer menú, búsqueda, zoom suave en PDP, header al scroll.
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initHeaderScroll();
    initMobileNav();
    initSearchOverlay();
    initProductZoom();
    initProductGallery();
  });

  /** Sticky header: sombra suave al hacer scroll */
  function initHeaderScroll() {
    var header = document.querySelector('[data-allset-header]');
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /** Menú móvil (drawer) */
  function initMobileNav() {
    var toggle = document.querySelector('[data-allset-menu-open]');
    var drawer = document.querySelector('[data-allset-drawer]');
    var closeBtn = document.querySelector('[data-allset-menu-close]');
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) close();
      else open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);

    drawer.addEventListener('click', function (e) {
      if (e.target === drawer.querySelector('[data-allset-drawer-backdrop]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /** Overlay de búsqueda */
  function initSearchOverlay() {
    var openBtn = document.querySelector('[data-allset-search-open]');
    var overlay = document.querySelector('[data-allset-search]');
    var closeBtn = document.querySelector('[data-allset-search-close]');
    var input = overlay ? overlay.querySelector('input[type="search"]') : null;
    if (!openBtn || !overlay) return;

    function open() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (input) {
        setTimeout(function () {
          input.focus();
        }, 200);
      }
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  /**
   * Zoom suave en imagen principal del producto (mousemove).
   * Respeta prefers-reduced-motion vía CSS; aquí desactivamos si no hay hover fino (touch).
   */
  function initProductZoom() {
    var stage = document.querySelector('[data-allset-product-stage]');
    var img = stage ? stage.querySelector('img') : null;
    if (!stage || !img) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var maxScale = 1.35;

    stage.addEventListener('mousemove', function (e) {
      var rect = stage.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      x = Math.min(1, Math.max(0, x));
      y = Math.min(1, Math.max(0, y));
      var originX = x * 100;
      var originY = y * 100;
      img.style.transformOrigin = originX + '% ' + originY + '%';
      img.style.transform = 'scale(' + maxScale + ')';
    });

    stage.addEventListener('mouseleave', function () {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
    });
  }

  /** Miniaturas PDP: cambiar imagen principal */
  function initProductGallery() {
    var root = document.querySelector('[data-allset-product-gallery]');
    if (!root) return;
    var mainImg = root.querySelector('.allset-product__stage img');
    var thumbs = root.querySelectorAll('[data-allset-product-thumb]');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-full-src');
        var srcset = btn.getAttribute('data-full-srcset') || '';
        var alt = btn.getAttribute('data-alt') || '';
        if (src) {
          mainImg.src = src;
          if (srcset) {
            mainImg.srcset = srcset;
          } else if (mainImg.hasAttribute('srcset')) {
            mainImg.removeAttribute('srcset');
          }
          mainImg.alt = alt;
        }
        thumbs.forEach(function (t) {
          t.classList.toggle('is-active', t === btn);
        });
      });
    });
  }
})();
