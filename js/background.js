let pageChange = false;

chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.local.set({ enabled: true });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes('cid=')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'post_change'
      });
    } else {
      // need to send message when title of course is sent, not when url changes
      pageChange = true;
    }
  } else if (pageChange && changeInfo.title) {
    chrome.tabs.sendMessage(tabId, {
      type: 'course_change'
    });
    pageChange = false;
  }
});
