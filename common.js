'use strict';

chrome.windows.onRemoved.addListener(() => {
  chrome.storage.local.get({
    'clean-on-exit': false,
    'clean-object': null
  }, prefs => {
    if (prefs['clean-on-exit'] && prefs['clean-object']) {
      chrome.windows.getAll({
        populate: false,
        windowTypes: ['normal']
      }, wins => {
        if (wins.length === 0) {
          const obj = prefs['clean-object'];
          chrome.browsingData.remove(obj.options, obj.dataToRemove, () => {
            chrome.notifications.create(null, {
              type: 'basic',
              iconUrl: '/data/icons/48.png',
              title: 'eCleaner (Forget Button)',
              message: 'Cleaning before exit is done!'
            });
          });
        }
      });
    }
  });
});

// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': navigator.userAgent.toLowerCase().indexOf('firefox') === -1
}, prefs => {
  const version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    chrome.storage.local.set({version}, () => {
      chrome.tabs.create({
        url: 'http://add0n.com/ecleaner.html?version=' + version +
          '&type=' + (prefs.version ? ('upgrade&p=' + prefs.version) : 'install')
      });
    });
  }
});
(function() {
  const {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL('http://add0n.com/feedback.html?name=' + name + '&version=' + version);
})();
