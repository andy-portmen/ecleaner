'use strict';

const toast = document.getElementById('toast');

// restore
document.addEventListener('DOMContentLoaded', () => chrome.storage.local.get({
  'notification': true
}, prefs => {
  document.getElementById('notification').checked = prefs['notification'];
}));

// save
document.getElementById('save').addEventListener('click', () => chrome.storage.local.set({
  'notification': document.getElementById('notification').checked
}, () => {
  toast.textContent = 'Options saved.';
  setTimeout(() => toast.textContent = '', 750);
}));

// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    toast.textContent = 'Double-click to reset!';
    window.setTimeout(() => toast.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});

// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));

// rate
document.getElementById('rate').onclick = () => {
  let url = 'https://chrome.google.com/webstore/detail/ecleaner-forget-button/ejhlpopncnfaaeicmbdnddebccnkfenn/reviews';
  if (/Edg/.test(navigator.userAgent)) {
    url = 'https://microsoftedge.microsoft.com/addons/detail/lkijkhmdocigocildmafdnpjakbhdmel';
  }
  else if (/Firefox/.test(navigator.userAgent)) {
    url = 'https://addons.mozilla.org/firefox/addon/ecleaner-forget-button/reviews/';
  }
  else if (/OPR/.test(navigator.userAgent)) {
    url = 'https://addons.opera.com/extensions/details/ecleaner-forget-button/';
  }

  chrome.storage.local.set({
    'rate': false
  }, () => chrome.tabs.create({
    url
  }));
};
