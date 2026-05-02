const zone = document.createElement('div');
zone.id = 'yt-hover-zone';
document.body.appendChild(zone);

const bar = document.createElement('div');
bar.id = 'yt-float-bar';
bar.innerHTML = `
  <a id="yt-logo" href="https://www.youtube.com/" title="Go to YouTube Home">
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="26" height="18" rx="5" stroke="rgba(255,255,255,0.8)" stroke-width="1.8"/>
      <polygon points="11.5,6 11.5,14 19,10" fill="rgba(255,255,255,0.8)"/>
    </svg>
  </a>
  <div id="yt-divider"></div>
  <div id="yt-input-wrap">
    <input id="yt-float-input" type="text" placeholder="Search YouTube..." autocomplete="off" />
    <div id="yt-suggestions"></div>
  </div>
  <button id="yt-float-btn" title="Search">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </button>
  <div id="yt-divider2"></div>
  <div id="yt-profile-wrap">
    <button id="yt-profile-btn" title="Account">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    </button>
    <div id="yt-profile-menu">
      <a class="yt-menu-item" href="https://www.youtube.com/channel_switcher" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Switch account
      </a>
      <a class="yt-menu-item" href="https://accounts.google.com/SignOutOptions" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign out
      </a>
      <div class="yt-menu-divider"></div>
      <a class="yt-menu-item" href="https://studio.youtube.com/" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
        YouTube Studio
      </a>
      <a class="yt-menu-item" href="https://www.youtube.com/paid_memberships" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Purchases &amp; memberships
      </a>
      <div class="yt-menu-divider"></div>
      <a class="yt-menu-item" href="https://www.youtube.com/account" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        Settings
      </a>
      <a class="yt-menu-item" href="https://support.google.com/youtube" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Help
      </a>
    </div>
  </div>
`;
document.body.appendChild(bar);

const input = document.getElementById('yt-float-input');
const suggestions = document.getElementById('yt-suggestions');
const profileBtn = document.getElementById('yt-profile-btn');
const profileMenu = document.getElementById('yt-profile-menu');
let selectedIndex = -1;
let debounceTimer;
let menuOpen = false;

function injectAvatar() {
  const ytAvatar = document.querySelector('ytd-masthead #avatar img, ytd-topbar-logo-renderer + * img#img');
  if (ytAvatar && ytAvatar.src) {
    profileBtn.innerHTML = `<img src="${ytAvatar.src}" width="26" height="26" style="border-radius:50%;object-fit:cover;">`;
  }
}
setTimeout(injectAvatar, 2000);

profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuOpen = !menuOpen;
  profileMenu.classList.toggle('visible', menuOpen);
});

document.addEventListener('click', () => { menuOpen = false; profileMenu.classList.remove('visible'); });
profileMenu.addEventListener('click', e => e.stopPropagation());

function doSearch(query) {
  const q = (query || input.value).trim();
  if (q) window.location.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
}

function hideSuggestions() {
  suggestions.innerHTML = '';
  suggestions.classList.remove('visible');
  selectedIndex = -1;
}

async function fetchSuggestions(query) {
  if (!query.trim()) { hideSuggestions(); return; }
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const items = data[1].slice(0, 8);
    if (!items.length) { hideSuggestions(); return; }
    suggestions.innerHTML = items.map((s, i) =>
      `<div class="yt-suggest-item" data-index="${i}" data-value="${s.replace(/"/g,'&quot;')}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${s}</span>
      </div>`
    ).join('');
    suggestions.classList.add('visible');
    selectedIndex = -1;
    suggestions.querySelectorAll('.yt-suggest-item').forEach(el => {
      el.addEventListener('mousedown', e => { e.preventDefault(); doSearch(el.dataset.value); });
      
    });
  } catch(e) { hideSuggestions(); }
}

function updateSelected() {
  suggestions.querySelectorAll('.yt-suggest-item').forEach((el, i) => {
    el.classList.toggle('selected', i === selectedIndex);
    if (i === selectedIndex) input.value = el.dataset.value;
  });
}

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchSuggestions(input.value), 150);
});

input.addEventListener('keydown', e => {
  const items = suggestions.querySelectorAll('.yt-suggest-item');
  if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); updateSelected(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, -1); updateSelected(); }
  else if (e.key === 'Enter') { hideSuggestions(); doSearch(); }
  else if (e.key === 'Escape') { hideSuggestions(); bar.classList.remove('visible'); input.blur(); }
});

document.getElementById('yt-float-btn').addEventListener('click', () => { hideSuggestions(); doSearch(); });

const params = new URLSearchParams(window.location.search);
if (params.get('search_query')) input.value = params.get('search_query');

let hideTimeout;
function showBar() { clearTimeout(hideTimeout); bar.classList.add('visible'); }
function scheduleHide() {
  hideTimeout = setTimeout(() => {
    if (document.activeElement !== input && !menuOpen) { bar.classList.remove('visible'); hideSuggestions(); }
  }, 300);
}

zone.addEventListener('mouseenter', showBar);
zone.addEventListener('mouseleave', scheduleHide);
bar.addEventListener('mouseenter', showBar);
bar.addEventListener('mouseleave', scheduleHide);
input.addEventListener('focus', showBar);
input.addEventListener('blur', scheduleHide);
