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
  if (!v || !track.src) return;
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

function textToBlobURL(body) {
  const blob = new Blob([body], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}

function srtToVtt(body) {
  const lines = body.trim().split('\n\n').map((dialog) => {
    const [, time, ...text] = dialog.split('\n');
    return [
      time.replace(/,/g, '.'),
      ...text,
    ].join('\n');
  });
  return [
    'WEBVTT',
    ...lines,
    '',
  ].join('\n\n');
}

module.exports = {
  setSubtitle,
  textToBlobURL,
  srtToVtt,
};
