const baseClassName = 'VideoPlayer__QualitySetting';
const activeClassName = `${baseClassName}--active`;
const itemBaseClassName = 'VideoPlayer__QualitySelector';
const itemActiveClassName = `${itemBaseClassName}--active`;

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
    title.innerText = '字幕';

    const e = document.createElement('div');
    e.classList.add(this.baseClassName);
    e.style.marginRight = '50px';
    e.appendChild(title);
    return e;
  }

  static createItemEl(track, id) {
    const t = document.createElement('li');
    t.dataset.id = id;
    t.innerText = track.label;
    t.classList.add(this.itemBaseClassName);
    t.addEventListener('click', (e) => {
      this.change(Number.parseInt(e.target.dataset.id, 10));
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
      this.tracksEl.appendChild(TrackSetting.createItemEl(track, id));
    });
  }

  replaceTracks(tracks) {
    this.tracks = [];
    this.tracksEl.innerHTML = '';
    this.appendTracks(tracks);
    this.activeTrack = 0;
  }

  change(id) {
    this.activeTrack = id;
    const tracks = this.tracksEl.children;
    for (let i = 0; i < tracks.length; i += 1) {
      if (i === id) {
        tracks[i].classList.add(itemActiveClassName);
      } else {
        tracks[i].classList.remove(itemActiveClassName);
      }
    }
    this.callback(new CustomEvent('change', {
      detail: this.tracks[id],
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
