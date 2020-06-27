/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */

const TrackSetting = require('./components/TrackSetting');
const TrackSettingActivator = require('./components/TrackSettingActivator');

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

function getVideoElement() {
  return document.querySelector('[ref=videoPlayerContainer] > video');
}

function appendSubtitleTrack(track) {
  const v = getVideoElement();
  if (!v) return;
  v.appendChild(track);
}

function replaceSubtitleTrack(track) {
  const v = getVideoElement();
  let child = v.firstElementChild;
  while (child) {
    v.removeChild(child);
    child = v.firstElementChild;
  }
  appendSubtitleTrack(track);
}

const trackSetting = new TrackSetting((e) => {
  if (e.type === 'change') {
    const { id, ...opts } = e.detail;
    replaceSubtitleTrack(createSubtitleTrack({ ...opts, default: true }));
  }
});

const trackSettingActivator = new TrackSettingActivator((e) => {
  if (e.type === 'click') {
    trackSetting.toggleShow();
  }
});

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

async function resolveTrackMeta(track) {
  const body = await fetch(track.src).then((e) => e.text());
  const blob = new Blob([body], { type: 'text/vtt' });
  return {
    ...track,
    src: URL.createObjectURL(blob),
  };
}

async function init() {
  trackSetting.inject();
  trackSettingActivator.inject();

  const eid = document.querySelector('[ref=video]').getAttribute('episodeid');
  const tracksMeta = await fetchTracksById(eid).map();
  const tracks = await Promise.all(tracksMeta.map(resolveTrackMeta));
  trackSetting.replaceTracks(tracks);
}

init();
