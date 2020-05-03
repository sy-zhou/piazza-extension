chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // const regex = /piazza.com/class/;
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      type: 'post_change',
      url: changeInfo.url
    })
  }
});
