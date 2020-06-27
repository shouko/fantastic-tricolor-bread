class TrackSetting {
  constructor(callback) {
    this.callback = callback;
    this.tracks = [];
    this.tracksEl = document.createElement('ul');
    this.activeTrack = null;
    this.baseClassName = 'VideoPlayer__QualitySetting';

    this.el = TrackSetting.createContainer();
    this.el.append(this.tracksEl);
  }

  static createContainer() {
    const title = document.createElement('div');
    title.classList.add(`${this.baseClassName}Title`);
    title.innerText = '字幕';

    const e = document.createElement('div');
    e.classList.add(this.baseClassName);
    e.style.marginRight = '50px';
    e.appendChild(title);
    return e;
  }

  static createItemEl(track, id) {
    const baseClassName = 'VideoPlayer__QualitySelector';
    const activeClassName = `${baseClassName}--active`;
    const t = document.createElement('li');
    t.dataset.id = id;
    t.innerText = track.label;
    t.classList.add(baseClassName);
    t.addEventListener('click', (e) => {
      this.callback(new CustomEvent('change', {
        detail: this.tracks[e.target.dataset.id],
      }));
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
  }

  show() {
    this.el.classList.add(`${this.baseClassName}--active`);
  }

  hide() {
    this.el.classList.remove(`${this.baseClassName}--active`);
  }

  toggleShow() {
    if (this.el.classList.contains(`${this.baseClassName}--active`)) {
      this.hide();
    } else {
      this.show();
    }
  }
}

module.exports = TrackSetting;
