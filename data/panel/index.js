'use strict';

const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

function settings() {
  const since = document.getElementById('since').querySelector(':checked').value;

  let types = [...document.getElementById('types').querySelectorAll(':checked')].map(e => e.value);
  if (isFirefox) {
    types = types.filter(t => ['indexedDB', 'localStorage', 'appcache', 'fileSystems', 'webSQL'].indexOf(t) === -1);
  }
  const zones = [...document.getElementById('zones').querySelectorAll(':checked')].map(e => e.value);
  const originTypes = zones.reduce((p, c) => Object.assign(p, {[c]: true}), {});
  if (isFirefox) {
    delete originTypes.protectedWeb;
    delete originTypes.extension;
  }
  const time = since === 'custom' ? Number(document.getElementById('time').value) * 60 * 60 : Number(since);

  return {
    time,
    types,
    originTypes,
    since
  };
}

document.getElementById('submit').addEventListener('click', ({target}) => {
  target.value = 'Please wait ...';
  target.disabled = true;

  const {since, time, types, originTypes} = settings();

  // persist
  chrome.storage.local.set({
    since,
    time: document.getElementById('time').value
  }, () => {
    const obj = {
      options: {
        'since': time ? (new Date()).getTime() - time * 1000 : time,
        originTypes
      },
      dataToRemove: types.reduce((p, c) => Object.assign(p, {[c]: true}), {})
    };

    chrome.browsingData.remove(obj.options, obj.dataToRemove, () => {
      window.setTimeout(() => {
        target.value = 'Done!';
        window.setTimeout(() => window.close(), 500);
      }, 500);
    });
  });
});

document.getElementById('exit').addEventListener('click', () => {
  const {time, types, originTypes} = settings();
  const obj = {
    options: {
      'since': time ? (new Date()).getTime() - time * 1000 : time,
      originTypes
    },
    dataToRemove: types.reduce((p, c) => Object.assign(p, {[c]: true}), {})
  };

  chrome.storage.local.set({
    'clean-object': obj,
    'clean-on-exit': true
  }, () => {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: '/data/icons/48.png',
      title: 'eCleaner (Forget Button)',
      message: 'Cleaning preferences are stored and will apply on every browser exit'
    });
  });
});

var last;

document.body.addEventListener('change', e => {
  const target = e.target;
  // persist
  if (target.type === 'checkbox') {
    chrome.storage.local.set({
      [target.value]: target.checked
    });
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
{
  const checkboxes = [...document.querySelectorAll('[type=checkbox]')];
  chrome.storage.local.get(checkboxes.reduce((p, c) => Object.assign(p, {
    [c.value]: c.checked
  }), {}), prefs => {
    Object.entries(prefs).forEach(([key, value]) => {
      document.querySelector(`[value="${key}"]`).checked = value;
    });
  });
  chrome.storage.local.get({
    since: 604800,
    time: 24
  }, prefs => {
    document.getElementById('since').querySelector(`[value="${prefs.since}"]`).checked = true;
    document.getElementById('time').value = prefs.time;
  });
}
