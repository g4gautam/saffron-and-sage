const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YoutubeMetadata {
  title: string;
  duration: string;
  thumbnail: string;
}

export const getVideoMetadata = async (videoId: string): Promise<YoutubeMetadata | null> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('VITE_YOUTUBE_API_KEY is not defined');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const duration = parseIsoDuration(item.contentDetails.duration);
      return {
        title: item.snippet.title,
        duration,
        thumbnail: item.snippet.thumbnails.high.url,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
};

const parseIsoDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
