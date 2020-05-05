let enabled = true; // enabled by default
let disableButton = document.getElementById("disableButton");

chrome.storage.local.get('enabled', data => {
  enabled = !!data.enabled;
  disableButton.textContent = enabled ? 'Disable' : 'Enable';
});

disableButton.onclick = () => {
  enabled = !enabled;
  disableButton.textContent = enabled ? 'Disable' : 'Enable';
  chrome.storage.local.set({ enabled: enabled });
  // reload Piazza if it is open
  chrome.tabs.query({ url: '*://piazza.com/class/*' }, arrayOfTabs => {
    chrome.tabs.reload(arrayOfTabs[0].id);
  });
};