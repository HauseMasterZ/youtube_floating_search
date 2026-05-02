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
  <input id="yt-float-input" type="text" placeholder="Search YouTube..." autocomplete="off" />
  <button id="yt-float-btn">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </button>
`;
document.body.appendChild(bar);

function doSearch() {
  const q = document.getElementById('yt-float-input').value.trim();
  if (q) window.location.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
}

document.getElementById('yt-float-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
  if (e.key === 'Escape') { bar.classList.remove('visible'); e.target.blur(); }
});
document.getElementById('yt-float-btn').addEventListener('click', doSearch);

const params = new URLSearchParams(window.location.search);
if (params.get('search_query')) {
  document.getElementById('yt-float-input').value = params.get('search_query');
}

let hideTimeout;

function showBar() { clearTimeout(hideTimeout); bar.classList.add('visible'); }
function scheduleHide() {
  hideTimeout = setTimeout(() => {
    if (document.activeElement !== document.getElementById('yt-float-input')) {
      bar.classList.remove('visible');
    }
  }, 300);
}

zone.addEventListener('mouseenter', showBar);
zone.addEventListener('mouseleave', scheduleHide);
bar.addEventListener('mouseenter', showBar);
bar.addEventListener('mouseleave', scheduleHide);
document.getElementById('yt-float-input').addEventListener('focus', showBar);
document.getElementById('yt-float-input').addEventListener('blur', scheduleHide);
