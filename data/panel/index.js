'use strict';

document.getElementById('submit').addEventListener('click', () => {
  let since = +document.getElementById('since').querySelector(':checked').value;
  let types = Array.from(document.getElementById('types').querySelectorAll(':checked')).map(e => e.value);
  let zones = Array.from(document.getElementById('zones').querySelectorAll(':checked')).map(e => e.value);
  chrome.browsingData.remove({
    'since': since ? (new Date()).getTime() - since * 1000 : since,
    'originTypes': zones.reduce((p,c) => {p[c] = true; return p;}, {})
  }, types.reduce((p,c) => {p[c] = true; return p;}, {}), () => {
    //window.close();
  });
});
var last;

document.body.addEventListener('change', (e) => {
  let target = e.target;
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
