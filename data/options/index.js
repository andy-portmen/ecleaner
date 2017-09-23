'use strict';

function save() {
  chrome.storage.local.set({
    'clean-on-exit': document.getElementById('clean-on-exit').checked
  }, () => {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore() {
  chrome.storage.local.get({
    'clean-on-exit': false
  }, prefs => {
    document.getElementById('clean-on-exit').checked = prefs['clean-on-exit'];
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
