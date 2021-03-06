const { textToBlobURL, srtToVtt } = require('../utils/subtitle');

const baseClassName = 'VideoPlayer__QualitySetting';
const activeClassName = `${baseClassName}--active`;
const itemBaseClassName = 'VideoPlayer__QualitySelector';
const itemActiveClassName = `${itemBaseClassName}--active`;

const specialTracks = {
  off: {
    id: -1,
    label: 'オフ',
  },
  custom: {
    id: -2,
    label: 'ファイル選択',
  },
};

class TrackSetting {
  constructor(callback) {
    this.callback = callback;
    this.tracks = [];
    this.tracksEl = document.createElement('ul');
    this.activeTrack = null;

    this.el = TrackSetting.createContainer();
    this.el.append(this.tracksEl);
  }

  static createContainer() {
    const title = document.createElement('div');
    title.classList.add(`${baseClassName}Title`);
    title.innerHTML = '字幕&nbsp;<a href="https://github.com/shouko/fantastic-tricolor-bread/blob/master/CONTRIBUTING.md" style="color: cyan;" target="_blank">[?]</a>';

    const e = document.createElement('div');
    e.classList.add(baseClassName);
    e.style.marginRight = '50px';
    e.appendChild(title);
    return e;
  }

  static createItemEl(track, id, _this) {
    const t = document.createElement('li');
    t.dataset.id = id;
    t.innerText = track.label;
    t.classList.add(itemBaseClassName);
    t.addEventListener('click', (e) => {
      _this.change(Number.parseInt(e.target.dataset.id, 10));
    });
    return t;
  }

  inject() {
    if (document.contains(this.el)) return;
    const playerContainer = document.querySelector('[ref=videoPlayerContainer]');
    const qualitySetting = document.querySelector('[ref=videoPlayerContainer] > .VideoPlayer__QualitySetting');
    if (!playerContainer || !qualitySetting) return;
    playerContainer.insertBefore(this.el, qualitySetting);
  }

  appendTracks(tracks) {
    tracks.forEach((track) => {
      const id = this.tracks.length;
      this.tracks.push(track);
      this.tracksEl.appendChild(TrackSetting.createItemEl(track, id, this));
    });
  }

  replaceTracks(tracks) {
    this.tracks = [];
    this.tracksEl.innerHTML = '';
    this.tracksEl.appendChild(TrackSetting.createItemEl(
      { label: specialTracks.off.label },
      specialTracks.off.id, this,
    ));
    this.tracksEl.appendChild(TrackSetting.createItemEl(
      { label: specialTracks.custom.label },
      specialTracks.custom.id, this,
    ));
    this.appendTracks(tracks);
    this.activeTrack = 0;
  }

  importCustomTrack() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.srt,.vtt,text/vtt';
    input.onchange = (e) => {
      if (e.target.files.length === 0) return;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (ev) => {
        let { result } = ev.target;
        if (file.name.endsWith('.srt')) {
          result = srtToVtt(result);
        }
        const nextTrack = this.tracks.length;
        this.appendTracks([{ label: `Track ${nextTrack}`, src: textToBlobURL(result) }]);
        this.change(nextTrack);
      };
    };
    input.click();
  }

  getTrackData(id) {
    if (id === specialTracks.off.id) {
      return {};
    }
    return this.tracks[id];
  }

  change(id) {
    if (id === specialTracks.custom.id) {
      this.importCustomTrack();
      return;
    }
    this.activeTrack = id;
    const tracks = this.tracksEl.children;
    for (let i = 0; i < tracks.length; i += 1) {
      if (Number.parseInt(tracks[i].dataset.id, 10) === id) {
        tracks[i].classList.add(itemActiveClassName);
      } else {
        tracks[i].classList.remove(itemActiveClassName);
      }
    }
    this.callback(new CustomEvent('change', {
      detail: this.getTrackData(id),
    }));
  }

  show() {
    this.el.classList.add(activeClassName);
  }

  hide() {
    this.el.classList.remove(activeClassName);
  }

  toggleShow() {
    if (this.el.classList.contains(activeClassName)) {
      this.hide();
    } else {
      this.show();
    }
  }
}

module.exports = TrackSetting;
