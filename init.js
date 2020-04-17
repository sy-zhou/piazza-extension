console.log('Welcome to Piazza!');

document.querySelector('head').innerHTML += `<link rel="stylesheet" href="${chrome.extension.getURL('base.css')}" type="text/css" />`;