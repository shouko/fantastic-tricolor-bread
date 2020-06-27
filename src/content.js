/* eslint-disable max-classes-per-file */
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

  const eid = document.querySelector('[ref=video]').getAttribute('episodeid');
  const tracks = await fetchTracksById(eid);
  trackSetting.replaceTracks(tracks);
}

init();
