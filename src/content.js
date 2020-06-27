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
  v.appendChild(track);
}

async function fetchSubtitlesData(eid) {
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
  const next = document.querySelector('[ref=videoPlayerContainer] > .VideoPlayer__QualitySetting');
  if (!p || !next) return;
  p.insertBefore(el, next);
}

function createTrackSelectorActivator() {
  /*
  const path = document.createElement('path');
  // TODO: Add real icon
  path.setAttribute('d', 'FOOBAR');

  const svg = document.createElement('svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.appendChild(path);
  */

  const svg = document.createElement('div');
  svg.innerText = '字';
  const style = {
    margin: '0 auto',
    height: '30px',
    width: '20px',
    fontSize: '20px',
  };
  Object.entries(style).forEach(([key, val]) => {
    svg.style[key] = val;
  });

  const svgContainer = document.createElement('div');
  svgContainer.classList.add('SvgIcon');
  svgContainer.classList.add('SvgIcon--default');
  svgContainer.classList.add('SvgIcon--medium');

  const e = document.createElement('div');
  e.classList.add('VideoPlayer__GearIcon');
  e.addEventListener('click', () => {
    // toggle track selector
  });

  svgContainer.appendChild(svg);
  e.appendChild(svgContainer);
  return e;
}

function injectTrackSelectorActivator(el) {
  const p = document.querySelector('.VideoPlayer__Option');
  const next = document.querySelector('.VideoPlayer__Option > .VideoPlayer__GearIcon');
  if (!p || !next) return;
  p.insertBefore(el, next);
}

async function init() {
  const eid = document.querySelector('[ref=video]').getAttribute('episodeid');
  const tracksMeta = await fetchSubtitlesData(eid).map();
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
  injectTrackSelector(createTrackSelector(tracks));
  injectTrackSelectorActivator(createTrackSelectorActivator());
}

init();
