'use strict';

const notify = e => chrome.notifications.create({
  type: 'basic',
  iconUrl: '/data/icons/48.png',
  title: chrome.runtime.getManifest().name,
  message: e.message || e
});

const clean = () => {
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
              notify('Cleaning before Exit...');
            }
          });
        }
      });
    }
  });
};
chrome.windows.onRemoved.addListener(clean);

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
            tabs.query({active: true, currentWindow: true}, tbs => tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install',
              ...(tbs && tbs.length && {index: tbs[0].index + 1})
            }));
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
