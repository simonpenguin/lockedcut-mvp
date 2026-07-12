export type VideoProvider = 'youtube' | 'vimeo' | 'mp4' | 'unknown';

export interface ParsedVideo {
  provider: VideoProvider;
  id: string; // The extracted ID or the direct URL if it's an mp4
  embedUrl: string; // The formatted URL ready for an iframe src
}

export function parseVideoUrl(url: string): ParsedVideo {
  const cleanUrl = url.trim();

  // Check for raw MP4
  if (cleanUrl.toLowerCase().endsWith('.mp4')) {
    return {
      provider: 'mp4',
      id: cleanUrl,
      embedUrl: cleanUrl,
    };
  }

  // Check for YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = cleanUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
    };
  }

  // Check for Vimeo
  // Matches: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoRegex = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
  const vimeoMatch = cleanUrl.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      id: videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  // Unknown format
  return {
    provider: 'unknown',
    id: '',
    embedUrl: '',
  };
}
