/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */

let trackSelector = null;
let trackSelectorActivator = null;

class TrackSelector {
  constructor(tracks) {
    this.list = document.createElement('ul');
    tracks.forEach((track) => {
      this.list.appendChild(TrackSelector.createItem(track));
    });

    this.el = TrackSelector.createContainer();
    this.el.append(this.list);
  }

  static createContainer() {
    const title = document.createElement('div');
    title.classList.add('VideoPlayer__QualitySettingTitle');
    title.innerText = '字幕';

    const e = document.createElement('div');
    e.classList.add('VideoPlayer__QualitySetting');
    e.style.marginRight = '50px';
    e.appendChild(title);
    return e;
  }

  static createItem(track) {
    const baseClassName = 'VideoPlayer__QualitySelector';
    const activeClassName = `${baseClassName}--active`;
    const t = document.createElement('li');
    t.dataset.id = track.id;
    t.innerText = track.label;
    t.classList.add(baseClassName);
    t.addEventListener('click', (e) => {
      // TODO: Switch subtitle track to current
      const parent = e.target.parentElement;
      if (parent) {
        const siblings = parent.children;
        for (let i = 0; i < siblings.length; i += 1) {
          siblings[i].classList.remove(activeClassName);
        }
      }
      e.target.classList.add(activeClassName);
    });
    return t;
  }

  inject() {
    if (document.contains(this.el)) return;
    const playerContainer = document.querySelector('[ref=videoPlayerContainer]');
    const qualitySelector = document.querySelector('[ref=videoPlayerContainer] > .VideoPlayer__QualitySetting');
    if (!playerContainer || !qualitySelector) return;
    playerContainer.insertBefore(this.el, qualitySelector);
  }
}

class TrackSelectorActivator {
  constuctor() {
    const icon = TrackSelectorActivator.createIcon();
    const iconContainer = TrackSelectorActivator.createIconContainer();
    iconContainer.appendChild(icon);

    const e = document.createElement('div');
    e.classList.add('VideoPlayer__GearIcon');
    e.addEventListener('click', () => {
      // toggle track selector
    });
    e.appendChild(iconContainer);
    this.el = e;
  }

  static createIcon() {
    /*
    const path = document.createElement('path');
    // TODO: Add real icon
    path.setAttribute('d', 'FOOBAR');

    const svg = document.createElement('svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.appendChild(path);
    */

    const el = document.createElement('div');
    el.innerText = '字';
    const style = {
      margin: '0 auto',
      height: '30px',
      width: '20px',
      fontSize: '20px',
    };
    Object.entries(style).forEach(([key, val]) => {
      el.style[key] = val;
    });
    return el;
  }

  static createIconContainer() {
    const el = document.createElement('div');
    el.classList.add('SvgIcon');
    el.classList.add('SvgIcon--default');
    el.classList.add('SvgIcon--medium');
    return el;
  }

  inject() {
    if (document.contains(this.el)) return;
    const p = document.querySelector('.VideoPlayer__Option');
    const next = document.querySelector('.VideoPlayer__Option > .VideoPlayer__GearIcon');
    if (!p || !next) return;
    p.insertBefore(this.el, next);
  }
}

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
  if (!trackSelector) trackSelector = new TrackSelector();
  trackSelector.inject();
  if (!trackSelectorActivator) trackSelectorActivator = new TrackSelectorActivator();
  trackSelectorActivator.inject();
}

init();
