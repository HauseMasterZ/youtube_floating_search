const inject = () => {
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

  const profileBtn = document.getElementById('yt-profile-btn');
  const avatarRoot = document.querySelector('ytd-app, ytm-app') || document.body;
  const avatarObs = new MutationObserver(() => {
    const img = document.querySelector('ytd-masthead #avatar img, ytm-app .mobile-topbar-header img[class*="avatar"]');
    if (img?.src && img.src !== location.href) {
      profileBtn.innerHTML = `<img src="${img.src}" width="26" height="26" style="border-radius:50%;object-fit:cover">`;
      avatarObs.disconnect();
    }
  });
  avatarObs.observe(avatarRoot, { childList: true, subtree: true });

  const input = document.getElementById('yt-float-input');
  const searchBtn = document.getElementById('yt-float-btn');
  const profileMenu = document.getElementById('yt-profile-menu');
  let selIdx = -1, debounceTimer, menuOpen = false, lastQuery = '', hideTimeout, controller = null, suggItems = [];

  profileBtn.addEventListener('click', e => {
    e.stopPropagation();
    hideSugg();
    input.blur();
    menuOpen = !menuOpen;
    profileMenu.classList.toggle('visible', menuOpen);
  });
  document.addEventListener('click', () => { menuOpen = false; profileMenu.classList.remove('visible'); }, { passive: true });
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
  });

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
          <span style="max-width: ${(input.offsetWidth*1.2)}px">
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
    if      (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx+1, suggItems.length-1); updateSel(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); selIdx = Math.max(selIdx-1, -1); updateSel(); }
    else if (e.key === 'Enter')     { hideSugg(); doSearch(); }
    else if (e.key === 'Escape')    { hideSugg(); bar.classList.remove('visible'); input.blur(); }
  });

  searchBtn.addEventListener('click', () => { hideSugg(); doSearch(); });

  const p = new URLSearchParams(location.search).get('search_query');
  if (p) input.value = p;
  const showBar = () => { clearTimeout(hideTimeout); bar.classList.add('visible'); wrapper.classList.add('bar-visible'); };
  const schedHide = () => {
    hideTimeout = setTimeout(() => {
      if (document.activeElement !== input && !menuOpen) { bar.classList.remove('visible'); wrapper.classList.remove('bar-visible'); hideSugg(); }
    }, 300);
  };


  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasHover) {
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
  });

  if (!hasHover) {
    const zone = document.createElement('div');
    zone.id = 'yt-hover-zone';
    document.body.appendChild(zone);
    const applyFix = () => {
      document.querySelectorAll('ytm-chip-cloud-renderer.chip-bar').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
      document.querySelectorAll('div.rich-grid-renderer-header.rich-grid-sticky-header').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    };
    applyFix();
    zone.addEventListener('click', showBar, { passive: true });
    new MutationObserver(applyFix).observe(document.body, { childList: true, subtree: false });
  }

  if (!hasHover) {
    const forceHide = () => {
      clearTimeout(hideTimeout);
      input.blur();
      bar.classList.remove('visible');
      wrapper.classList.remove('bar-visible');
      hideSugg();
    };
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    const minScrollThreshold = 10;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      const y = window.scrollY;
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

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
};

'requestIdleCallback' in window
  ? requestIdleCallback(inject, { timeout: 3000 })
  : window.addEventListener('load', inject, { once: true });
