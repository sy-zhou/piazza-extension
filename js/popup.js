let enabled = true; // enabled by default
let disableButton = document.getElementById("disableButton");

chrome.storage.sync.get('enabled', data => {
  enabled = !!data.enabled;
  disableButton.textContent = enabled ? 'Disable' : 'Enable';
});

disableButton.onclick = () => {
  enabled = !enabled;
  disableButton.textContent = enabled ? 'Disable' : 'Enable';
  chrome.storage.sync.set({ enabled: enabled });
};