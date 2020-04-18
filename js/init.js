console.log('Welcome to Piazza!');

chrome.storage.sync.get('enabled', data => {
  if (data.enabled) {
    document.querySelector('head').innerHTML += `<link rel="stylesheet" type="text/css" href="${chrome.extension.getURL('base.css')}" />`;
  }
});

// first attempt to make page feed resizeable

const pageFeed = document.getElementById('feed');
const pageCenter = document.getElementById('page_center');
const pageBottomBar = document.getElementById('page_bottom_bar');

let m_pos;
function resize(e) {
  const dx = e.x - m_pos;
  m_pos = e.x;
  const width = parseInt(getComputedStyle(pageFeed, '').width) + dx;
  pageFeed.style.width = width + "px";
  pageCenter.style.left = width + "px";
  pageBottomBar.style.left = width + "px";
}

pageFeed.addEventListener('mousedown', (e) => {
  if ($('#feed').width() - e.offsetX <= 3) {
    m_pos = e.x;
    document.addEventListener('mousemove', resize, false);
  }
});

document.addEventListener("mouseup", function(){
  document.removeEventListener("mousemove", resize, false);
});
