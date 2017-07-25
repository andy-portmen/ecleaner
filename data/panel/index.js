'use strict';

document.getElementById('submit').addEventListener('click', e => {
  e.target.value = 'Please wait ...';
  e.target.disabled = true;
  const since = Number(document.getElementById('since').querySelector(':checked').value);
  let types = [...document.getElementById('types').querySelectorAll(':checked')].map(e => e.value);
  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    types = types.filter(t => ['appcache', 'fileSystems', 'webSQL'].indexOf(t) === -1);
  }
  const zones = [...document.getElementById('zones').querySelectorAll(':checked')].map(e => e.value);
  // persist
  localStorage.setItem('since', since);

  const originTypes = zones.reduce((p, c) => Object.assign(p, {[c]: true}), {});
  if (/Firefox/.test(navigator.userAgent)) {
    delete originTypes.protectedWeb;
    delete originTypes.extension;
  }
  chrome.browsingData.remove({
    'since': since ? (new Date()).getTime() - since * 1000 : since,
    originTypes
  }, types.reduce((p, c) => Object.assign(p, {[c]: true}), {}), () => {
    window.setTimeout(() => {
      e.target.value = 'Done!';
      window.setTimeout(() => window.close(), 500);
    }, 500);
  });
});
var last;

document.body.addEventListener('change', e => {
  const target = e.target;
  // persist
  if (target.type === 'checkbox') {
    localStorage.setItem(target.value, target.checked);
  }
  //
  const confirm = target.dataset.confirm;
  if (confirm && target.checked) {
    last = target;
    document.getElementById('confirm').style.display = 'flex';
  }
});
document.body.addEventListener('click', e => {
  const target = e.target;
  const cmd = target.dataset.cmd;
  const confirm = document.getElementById('confirm');
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
  const value = localStorage.getItem(checkbox.value);
  if (value !== null) {
    checkbox.checked = value === 'true';
  }
});
document.getElementById('since').querySelector(`[value="${localStorage.getItem('since')}"]`).checked = true;
