let endpoint = 'https://ichigo-milk-api.herokuapp.com';

function setEndpoint(url) {
  endpoint = url;
}

async function loadTrackBody(track) {
  const body = await fetch(track.src).then((e) => e.text());
  const blob = new Blob([body], { type: 'text/vtt' });
  return {
    ...track,
    src: URL.createObjectURL(blob),
  };
}

async function fetchTracksById(eid) {
  const { subtitles } = await fetch(`${endpoint}/episode/${eid}`).then((r) => r.json());
  return Promise.all(subtitles.map(loadTrackBody));
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

module.exports = {
  fetchTracksById,
  setEndpoint,
};
