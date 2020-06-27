/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */

const TrackSetting = require('./components/TrackSetting');
const TrackSettingActivator = require('./components/TrackSettingActivator');

let trackSetting = null;
let trackSettingActivator = null;

function createSubtitleTrack(opts) {
  const s = document.createElement('track');
  s.kind = 'subtitles';
  s.type = 'text/vtt';
  // srclang, label, src, default
  Object.entries(opts).forEach(([key, val]) => {
    s[key] = val;
  });
  return s;
}

function injectSubtitleTrack(track) {
  const v = document.querySelector('[ref=videoPlayerContainer] > video');
  if (!v) return;
  v.appendChild(track);
}

async function fetchTracksById(eid) {
  const { subtitles } = await fetch(`https://ichigo-milk-api.herokuapp.com/episode/${eid}`).then((r) => r.json());
  return subtitles;
/*
  [
    {
      srclang: 'zh-TW',
      label: '繁體中文',
      src: 'https://example.com/foo.vtt',
    },
    {
      srclang: 'ja',
      label: '日本語',
      src: 'https://example.com/bar.vtt',
    },
  ];
 */
}

async function init() {
  const eid = document.querySelector('[ref=video]').getAttribute('episodeid');
  const tracksMeta = await fetchTracksById(eid).map();
  const tracks = await Promise.all(tracksMeta.map(async (x) => {
    const body = await fetch(x.src).then((e) => e.text());
    const blob = new Blob([body], { type: 'text/vtt' });
    return {
      ...x,
      src: URL.createObjectURL(blob),
    };
  }));
  tracks.forEach((t) => {
    injectSubtitleTrack(createSubtitleTrack(t));
  });
  if (!trackSetting) trackSetting = new TrackSetting();
  trackSetting.inject();
  if (!trackSettingActivator) trackSettingActivator = new TrackSettingActivator();
  trackSettingActivator.inject();
}

init();
