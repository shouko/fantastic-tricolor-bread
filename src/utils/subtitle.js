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
  if (!v) return;
  let child = v.firstElementChild;
  while (child) {
    v.removeChild(child);
    child = v.firstElementChild;
  }
  appendSubtitleTrack(track);
}

function setSubtitle(opts) {
  replaceSubtitleTrack(createSubtitleTrack(opts));
}

module.exports = {
  setSubtitle,
};
