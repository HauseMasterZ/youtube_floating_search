const zone = document.createElement('div');
zone.id = 'yt-hover-zone';
document.body.appendChild(zone);

const bar = document.createElement('div');
bar.id = 'yt-float-bar';
bar.innerHTML = `
  <a id="yt-logo" href="https://www.youtube.com/" title="Go to YouTube Home">
    <svg width="32" height="22" viewBox="0 0 32 22" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="22" rx="5" fill="#FF0000"/>
      <polygon points="13,6 13,16 22,11" fill="white"/>
    </svg>
  </a>
  <div id="yt-divider"></div>
  <div id="yt-input-wrap">
    <input id="yt-float-input" type="text" placeholder="Search YouTube..." autocomplete="off" />
    <div id="yt-suggestions"></div>
  </div>
  <button id="yt-float-btn">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </button>
`;
document.body.appendChild(bar);

const input = document.getElementById('yt-float-input');
const suggestions = document.getElementById('yt-suggestions');
let selectedIndex = -1;
let debounceTimer;

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
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    const items = data[1].slice(0, 8);
    if (!items.length) { hideSuggestions(); return; }

    suggestions.innerHTML = items.map((s, i) =>
      `<div class="yt-suggest-item" data-index="${i}" data-value="${s.replace(/"/g, '&quot;')}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${s}</span>
      </div>`
    ).join('');
    suggestions.classList.add('visible');
    selectedIndex = -1;

    suggestions.querySelectorAll('.yt-suggest-item').forEach(el => {
      el.addEventListener('mousedown', e => { e.preventDefault(); doSearch(el.dataset.value); });
      el.addEventListener('mouseover', () => { selectedIndex = parseInt(el.dataset.index); updateSelected(); });
    });
  } catch(e) {
    hideSuggestions();
  }
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
    if (document.activeElement !== input) { bar.classList.remove('visible'); hideSuggestions(); }
  }, 300);
}

zone.addEventListener('mouseenter', showBar);
zone.addEventListener('mouseleave', scheduleHide);
bar.addEventListener('mouseenter', showBar);
bar.addEventListener('mouseleave', scheduleHide);
input.addEventListener('focus', showBar);
input.addEventListener('blur', scheduleHide);
