console.log('Welcome to Piazza!');

chrome.storage.sync.get('enabled', data => {
  if (data.enabled) {
    document.querySelector('head').innerHTML += `<link rel="stylesheet" href="${chrome.extension.getURL('base.css')}" type="text/css" />`;
  }
});