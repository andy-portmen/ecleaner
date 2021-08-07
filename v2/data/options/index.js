'use strict';

const toast = document.getElementById('toast');

function save() {
  chrome.storage.local.set({
    'clean-on-exit': document.getElementById('clean-on-exit').checked,
    'notification': document.getElementById('notification').checked
  }, () => {
    toast.textContent = 'Options saved.';
    setTimeout(() => toast.textContent = '', 750);
  });
}

function restore() {
  chrome.storage.local.get({
    'clean-on-exit': false,
    'notification': true
  }, prefs => {
    document.getElementById('clean-on-exit').checked = prefs['clean-on-exit'];
    document.getElementById('notification').checked = prefs['notification'];
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);

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
