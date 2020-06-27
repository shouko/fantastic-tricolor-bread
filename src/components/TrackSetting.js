class TrackSetting {
  constructor(tracks) {
    this.list = document.createElement('ul');
    tracks.forEach((track) => {
      this.list.appendChild(TrackSetting.createItem(track));
    });

    this.el = TrackSetting.createContainer();
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
    const qualitySetting = document.querySelector('[ref=videoPlayerContainer] > .VideoPlayer__QualitySetting');
    if (!playerContainer || !qualitySetting) return;
    playerContainer.insertBefore(this.el, qualitySetting);
  }
}

module.exports = TrackSetting;
