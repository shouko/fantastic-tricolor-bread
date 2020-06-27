class TrackSettingActivator {
  constuctor(callback) {
    this.callback = callback;

    const icon = TrackSettingActivator.createIcon();
    const iconContainer = TrackSettingActivator.createIconContainer();
    iconContainer.appendChild(icon);

    const e = document.createElement('div');
    e.classList.add('VideoPlayer__GearIcon');
    e.addEventListener('click', () => {
      this.callback(new Event('click'));
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

module.exports = TrackSettingActivator;
