/* eslint-disable no-console */

const TrackSetting = require('./components/TrackSetting');
const TrackSettingActivator = require('./components/TrackSettingActivator');
const { fetchTracksById } = require('./utils/api');
const { setSubtitle } = require('./utils/subtitle');

const trackSetting = new TrackSetting((e) => {
  if (e.type === 'change') {
    const { id, ...opts } = e.detail;
    setSubtitle({ ...opts, default: true });
  }
});

const trackSettingActivator = new TrackSettingActivator((e) => {
  if (e.type === 'click') {
    trackSetting.toggleShow();
  }
});

async function init() {
  trackSetting.inject();
  trackSettingActivator.inject();

  const playerContainer = document.querySelector('[ref=video]');
  if (!playerContainer) return;
  const eid = playerContainer.getAttribute('episodeid');
  const tracks = await fetchTracksById(eid);
  trackSetting.replaceTracks(tracks);
  if (tracks.length > 0) {
    trackSetting.change(0);
  } else {
    trackSetting.change(-1);
  }
}

const observer = new MutationObserver((mutations) => {
  let checked = 0;
  const checks = 2;
  for (let i = 0; i < mutations.length; i += 1) {
    const { target } = mutations[i];
    if (target.localName === 'div') {
      if (
        target.classList.contains('VideoPlayer__Option')
        && !target.classList.contains('VideoPlayer__Option--active')
      ) {
        trackSetting.hide();
        checked += 1;
      }
    } else if (target.localName === 'video') {
      if (target.classList.contains('VideoPlayer__Video')) {
        init();
        checked += 1;
      }
    }
    if (checked === checks) break;
  }
});

observer.observe(document.querySelector('main'), { attributes: true, subtree: true });

init();
