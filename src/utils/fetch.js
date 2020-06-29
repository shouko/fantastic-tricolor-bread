const fetch = (typeof content !== 'undefined' && typeof content.fetch === 'function') ? content.fetch : window.fetch;

module.exports = fetch;
