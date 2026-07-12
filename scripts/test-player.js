const ReactPlayer = require('react-player');
console.log(ReactPlayer.default ? ReactPlayer.default.canPlay : ReactPlayer.canPlay);
console.log('Can play YT?', (ReactPlayer.default || ReactPlayer).canPlay('https://www.youtube.com/watch?v=FQCzh13eEYY'));
