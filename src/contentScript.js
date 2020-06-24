/* eslint-disable no-console */

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
  v.crossOrigin = 'use-credentials';
  v.appendChild(track);
}

function fetchSubtitlesData(eid) {
  console.log(eid);
  return [
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
}

function createTrackSelectorItem(track) {
  const t = document.createElement('li');
  t.dataset.id = track.id;
  t.innerText = track.label;
  t.classList.add('VideoPlayer__QualitySelector');
  return t;
}

function createTrackSelector(tracks) {
  const title = document.createElement('div');
  title.classList.add('VideoPlayer__QualitySettingTitle');
  title.innerText = '字幕';

  const ul = document.createElement('ul');
  tracks.forEach((track) => {
    ul.appendChild(createTrackSelectorItem(track));
  });

  const e = document.createElement('div');
  e.classList.add('VideoPlayer__QualitySetting');
  e.appendChild(title);
  e.appendChild(ul);
  return e;
}

function injectTrackSelector(el) {
  const p = document.querySelector('[ref=videoPlayerContainer]');
  const qs = document.querySelector('[ref=videoPlayerContainer] > .VideoPlayer__QualitySetting');
  if (!p || !qs) return;
  p.insertBefore(el, qs);
}

function init() {
  const eid = document.querySelector('[ref=video]').getAttribute('episodeid');
  const tracks = fetchSubtitlesData(eid);
  tracks.forEach((t) => {
    injectSubtitleTrack(createSubtitleTrack(t));
  });
  injectTrackSelector(createTrackSelector(tracks));
}

init();
