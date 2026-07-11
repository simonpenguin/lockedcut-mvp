import { parseVideoUrl } from '../src/lib/videoParser';

const testUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://vimeo.com/123456789',
  'https://player.vimeo.com/video/123456789',
  'https://example.com/video.mp4',
  'invalid-url',
];

console.log('--- Video Parser Tests ---');
testUrls.forEach((url) => {
  console.log(`URL: ${url}`);
  console.log(parseVideoUrl(url));
  console.log('--------------------------');
});
