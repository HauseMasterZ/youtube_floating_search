(() => {
  'use strict';

  // Performance optimizations: Cache DOM elements and selectors
  const DOM_CACHE = new Map();
  const SELECTORS = {
    DESKTOP_CHIPS: 'ytd-feed-filter-chip-bar-renderer.style-scope.ytd-rich-grid-renderer, #frosted-glass.with-chipbar, yt-related-chip-cloud-renderer.style-scope.ytd-item-section-renderer',
    MOBILE_CHIPS: 'ytm-chip-cloud-renderer.chip-bar',
    MOBILE_HEADERS: 'div.rich-grid-renderer-header.rich-grid-sticky-header',
    AVATAR_IMG: 'ytd-masthead #avatar img, ytm-app .mobile-topbar-header img[class*="avatar"]'
  };

  // Debounce utility for performance
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Efficient DOM query with caching
  const getElements = (selector, useCache = true) => {
    if (useCache && DOM_CACHE.has(selector)) {
      return DOM_CACHE.get(selector);
    }
    const elements = Array.from(document.querySelectorAll(selector));
    if (useCache) DOM_CACHE.set(selector, elements);
    return elements;
  };

  // Optimized element hiding with batch operations
  const hideElements = (selector, forceUpdate = false) => {
    const elements = getElements(selector, !forceUpdate);
    elements.forEach(el => {
      if (getComputedStyle(el).display !== 'none') {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  };

  // Clear DOM cache periodically to prevent memory leaks
  const clearCache = debounce(() => DOM_CACHE.clear(), 5000);

  const inject = () => {
    if (document.getElementById('yt-float-wrapper')) return;

    const bar = document.createElement('div');
    bar.id = 'yt-float-bar';
    bar.innerHTML = `<a id="yt-logo" href="https://www.youtube.com/" title="YouTube Home"><svg width="28" height="20" viewBox="0 0 28 20" fill="none"><rect x="1" y="1" width="26" height="18" rx="5" stroke="rgba(255,255,255,0.8)" stroke-width="1.8"/><polygon points="11.5,6 11.5,14 19,10" fill="rgba(255,255,255,0.8)"/></svg></a><div id="yt-divider"></div><div id="yt-input-wrap"><input id="yt-float-input" type="text" placeholder="Search YouTube..." autocomplete="off" spellcheck="false"/></div><button id="yt-float-btn" title="Search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button><div id="yt-divider2"></div><div id="yt-profile-wrap"><button id="yt-profile-btn" title="Account"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></button><div id="yt-profile-menu"><a class="yt-menu-item" href="https://www.youtube.com/channel_switcher" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Switch account</a><a class="yt-menu-item" href="https://accounts.google.com/SignOutOptions" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign out</a><div class="yt-menu-divider"></div><a class="yt-menu-item" href="https://studio.youtube.com/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>YouTube Studio</a><a class="yt-menu-item" href="https://www.youtube.com/paid_memberships" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Purchases &amp; memberships</a><div class="yt-menu-divider"></div><a class="yt-menu-item" href="https://www.youtube.com/account" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>Settings</a><a class="yt-menu-item" href="https://support.google.com/youtube" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Help</a></div></div>`;

    const sugg = document.createElement('div');
    sugg.id = 'yt-suggestions';
    const wrapper = document.createElement('div');
    wrapper.id = 'yt-float-wrapper';
    wrapper.appendChild(bar);
    wrapper.appendChild(sugg);
    document.body.appendChild(wrapper);

    // Cache frequently used elements
    const input = bar.querySelector('#yt-float-input');
    const searchBtn = bar.querySelector('#yt-float-btn');
    const profileBtn = bar.querySelector('#yt-profile-btn');
    const profileMenu = bar.querySelector('#yt-profile-menu');

    let selIdx = -1, debounceTimer, menuOpen = false, lastQuery = '', hideTimeout, controller = null, suggItems = [];

    // Optimized avatar loading with single observer
    const updateAvatar = debounce(() => {
      const img = document.querySelector(SELECTORS.AVATAR_IMG);
      if (img?.src && img.src !== location.href) {
        profileBtn.innerHTML = `<img src="${img.src}" width="26" height="26" style="border-radius:50%;object-fit:cover">`;
      }
    }, 100);

    const avatarObs = new MutationObserver(updateAvatar);
    avatarObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

    // Profile menu handling
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      hideSugg();
      input.blur();
      menuOpen = !menuOpen;
      profileMenu.classList.toggle('visible', menuOpen);
    }, { passive: true });

    document.addEventListener('click', () => {
      menuOpen = false;
      profileMenu.classList.remove('visible');
    }, { passive: true });

    profileMenu.addEventListener('click', e => e.stopPropagation());

    const doSearch = q => {
      q = (q || input.value).trim();
      if (q) location.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
    };

    const hideSugg = () => {
      if (!suggItems.length) return;
      sugg.classList.remove('visible');
      selIdx = -1;
      suggItems = [];
    };

    sugg.addEventListener('mousedown', e => {
      const item = e.target.closest('.yt-suggest-item');
      if (item) { e.preventDefault(); doSearch(item.dataset.v); }
    }, { passive: true });

    const fetchSugg = async q => {
      if (!q.trim()) { hideSugg(); return; }
      if (q === lastQuery) return;
      lastQuery = q;
      if (controller) controller.abort();
      controller = new AbortController();
      try {
        const data = await (await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        )).json();
        const items = data[1].slice(0, 8);
        if (!items.length) { hideSugg(); return; }
        sugg.innerHTML = items.map(s =>
          `<div class="yt-suggest-item" data-v="${s.replace(/"/g, '&quot;')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style="max-width: ${(input.offsetWidth * 1.2)}px">
              ${s}
            </span>
          </div>`
        ).join('');
        sugg.classList.add('visible');
        selIdx = -1;
        suggItems = sugg.querySelectorAll('.yt-suggest-item');
      } catch (e) { if (e.name !== 'AbortError') hideSugg(); }
    };

    const updateSel = () => {
      suggItems.forEach((el, i) => {
        el.classList.toggle('selected', i === selIdx);
        if (i === selIdx) input.value = el.dataset.v;
      });
    };

    input.addEventListener('input', () => {
      lastQuery = '';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchSugg(input.value), 200);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx + 1, suggItems.length - 1); updateSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx - 1, -1); updateSel(); }
      else if (e.key === 'Enter') { hideSugg(); doSearch(); }
      else if (e.key === 'Escape') { hideSugg(); bar.classList.remove('visible'); input.blur(); }
    });

    searchBtn.addEventListener('click', () => { hideSugg(); doSearch(); }, { passive: true });

    const p = new URLSearchParams(location.search).get('search_query');
    if (p) input.value = p;

    const showBar = () => { clearTimeout(hideTimeout); bar.classList.add('visible'); wrapper.classList.add('bar-visible'); };
    const schedHide = () => {
      hideTimeout = setTimeout(() => {
        if (document.activeElement !== input && !menuOpen) { bar.classList.remove('visible'); wrapper.classList.remove('bar-visible'); hideSugg(); }
      }, 300);
    };

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Optimized desktop element hiding with debounced observer
    const hideDesktopChip = () => hideElements(SELECTORS.DESKTOP_CHIPS);

    if (hasHover) {
      hideDesktopChip();
      const observer = new MutationObserver(debounce(() => {
        clearTimeout(window.hideChromeTimeout);
        window.hideChromeTimeout = setTimeout(() => {
          hideElements(SELECTORS.DESKTOP_CHIPS, true);
          clearCache();
        }, 100);
      }, 50));
      observer.observe(document.body, { childList: true, subtree: true });
      wrapper.addEventListener('mouseenter', showBar, { passive: true });
      wrapper.addEventListener('mouseleave', schedHide, { passive: true });
    }

    input.addEventListener('focus', () => { showBar(); if (input.value.trim()) { lastQuery = ''; fetchSugg(input.value); } });
    input.addEventListener('blur', schedHide);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(hideTimeout);
        bar.classList.remove('visible');
        profileMenu.classList.remove('visible');
        sugg.classList.remove('visible');
        menuOpen = false;
        input.blur();
      }
    }, { passive: true });

    if (!hasHover) {
      const zone = document.createElement('div');
      zone.id = 'yt-hover-zone';
      document.body.appendChild(zone);

      // Optimized mobile element hiding
      const applyFix = () => {
        hideElements(SELECTORS.MOBILE_CHIPS);
        hideElements(SELECTORS.MOBILE_HEADERS);
      };
      applyFix();

      zone.addEventListener('click', showBar, { passive: true });

      // Debounced observer for mobile
      const observer = new MutationObserver(debounce(applyFix, 50));
      observer.observe(document.body, { childList: true, subtree: false });

      // Optimized scroll handling for mobile
      const forceHide = () => {
        clearTimeout(hideTimeout);
        input.blur();
        bar.classList.remove('visible');
        wrapper.classList.remove('bar-visible');
        hideSugg();
      };

      let lastScrollY = window.scrollY;
      let scrollTimeout;
      const minScrollThreshold = 1;
      const getScrollY = () => window.visualViewport?.pageTop ?? window.scrollY;

      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        const y = getScrollY();
        const delta = Math.abs(y - lastScrollY);

        if (delta >= minScrollThreshold) {
          if (y < lastScrollY && y > 0) {
            showBar();
          } else {
            forceHide();
          }
          lastScrollY = y;
        }

        scrollTimeout = setTimeout(() => {
          lastScrollY = y;
        }, 300);
      };

      // Use passive listeners and combine scroll sources
      const scrollOptions = { passive: true, capture: false };
      window.addEventListener('scroll', handleScroll, scrollOptions);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('scroll', handleScroll, scrollOptions);
        window.visualViewport.addEventListener('resize', handleScroll, scrollOptions);
      }
    }
  };

  // Use requestIdleCallback for better performance, fallback to load event
  'requestIdleCallback' in window
    ? requestIdleCallback(inject, { timeout: 3000 })
    : window.addEventListener('load', inject, { once: true });
})();
