'use strict';

document.getElementById('submit').addEventListener('click', (e) => {
  e.target.value = 'Please wait ...'
  e.target.disabled = true;
  let since = +document.getElementById('since').querySelector(':checked').value;
  let types = [...document.getElementById('types').querySelectorAll(':checked')].map(e => e.value);
  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    types = types.filter(t => ['appcache', 'fileSystems', 'webSQL'].indexOf(t) === -1);
  }
  let zones = [...document.getElementById('zones').querySelectorAll(':checked')].map(e => e.value);
  // persist
  localStorage.setItem('since', since);

  chrome.browsingData.remove({
    'since': since ? (new Date()).getTime() - since * 1000 : since,
    'originTypes': zones.reduce((p,c) => {p[c] = true; return p;}, {})
  }, types.reduce((p,c) => {p[c] = true; return p;}, {}), () => {
    window.setTimeout(() => {
      window.close();
    }, 1000);
  });
});
var last;

document.body.addEventListener('change', (e) => {
  let target = e.target;
  // persist
  if (target.type === 'checkbox') {
    localStorage.setItem(target.value, target.checked);
  }
  //
  let confirm = target.dataset.confirm;
  if (confirm && target.checked) {
    last = target;
    document.getElementById('confirm').style.display = 'flex';
  }
});
document.body.addEventListener('click', (e) => {
  let target = e.target;
  let cmd = target.dataset.cmd;
  let confirm = document.getElementById('confirm');
  if (cmd === 'uncheck' && last) {
    last.checked = false;
    if (last.type === 'radio') {
      document.getElementById('since').querySelector('input:nth-of-type(4)').checked = true;
    }
    confirm.style.display = 'none';
  }
  else if (cmd === 'hide') {
    confirm.style.display = 'none';
  }
});

// persist
[...document.querySelectorAll('[type=checkbox]')].forEach(checkbox => {
  let value = localStorage.getItem(checkbox.value);
  if (value !== null && checkbox.dataset.confirm !== 'true') {
    checkbox.checked = value === 'true';
  }
});
(function (since) {
  if (since && since !== '0') {
    document.getElementById('since').querySelector(`[value="${since}"]`).checked = true;
  }
})(localStorage.getItem('since'));
