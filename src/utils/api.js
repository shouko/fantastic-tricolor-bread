let endpoint = 'https://ichigo-milk-api.herokuapp.com';

function setEndpoint(url) {
  endpoint = url;
}

async function fetchTracksById(eid) {
  const { subtitles } = await fetch(`${endpoint}/episode/${eid}`).then((r) => r.json());
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

async function resolveTrackMeta(track) {
  const body = await fetch(track.src).then((e) => e.text());
  const blob = new Blob([body], { type: 'text/vtt' });
  return {
    ...track,
    src: URL.createObjectURL(blob),
  };
}

async function resolveTracks(tracks) {
  return Promise.all(tracks.map(resolveTrackMeta));
}

module.exports = {
  fetchTracksById,
  setEndpoint,
  resolveTracks,
};
