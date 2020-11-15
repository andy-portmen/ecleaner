'use strict';

chrome.windows.onRemoved.addListener(() => {
  chrome.storage.local.get({
    'clean-on-exit': false,
    'clean-object': null,
    'notification': true
  }, prefs => {
    if (prefs['clean-on-exit'] && prefs['clean-object']) {
      chrome.windows.getAll({
        populate: false,
        windowTypes: ['normal']
      }, wins => {
        if (wins.length === 0) {
          const obj = prefs['clean-object'];
          chrome.browsingData.remove(obj.options, obj.dataToRemove, () => {
            if (prefs.notification) {
              chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: '/data/icons/48.png',
                title: 'eCleaner (Forget Button)',
                message: 'Cleaning before exit is done!'
              });
            }
          });
        }
      });
    }
  });
});

/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install'
            });
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
