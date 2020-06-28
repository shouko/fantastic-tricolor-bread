const path = require('path');

module.exports = [{
  mode: 'production',
  entry: {
    background: path.join(__dirname, 'src', 'background.js'),
    content: path.join(__dirname, 'src', 'content.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
}];
