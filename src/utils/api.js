const { textToBlobURL } = require('./subtitle');
const fetch = require('./fetch');

let endpoint = 'https://ichigo-milk-api.herokuapp.com';

function setEndpoint(url) {
  endpoint = url;
}

async function loadTrackBody(track) {
  const body = await fetch(track.src).then((e) => e.text());
  return {
    ...track,
    src: textToBlobURL(body),
  };
}

async function fetchTracksById(eid) {
  try {
    const { subtitles } = await fetch(`${endpoint}/episode/${Number.parseInt(eid, 10)}`).then((r) => r.json());
    return Promise.all(subtitles.map(loadTrackBody));
  } catch (e) {
    return [];
  }
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
