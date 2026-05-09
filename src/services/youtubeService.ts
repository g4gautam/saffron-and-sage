const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const isYoutubeConfigured = (): boolean => Boolean(YOUTUBE_API_KEY);

export interface YoutubeMetadata {
  title: string;
  duration: string;
  thumbnail: string;
}

export interface YoutubeSearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

const decodeHtmlEntities = (s: string): string =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export const searchVideos = async (
  query: string,
  signal?: AbortSignal,
): Promise<YoutubeSearchResult[]> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('VITE_YOUTUBE_API_KEY is not defined');
    return [];
  }
  const trimmed = query.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    part: 'snippet',
    type: 'video',
    maxResults: '12',
    order: 'relevance',
    q: trimmed,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`YouTube search failed: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.items)) return [];

  return data.items
    .filter((item: any) => item?.id?.videoId)
    .map((item: any) => ({
      videoId: item.id.videoId,
      title: decodeHtmlEntities(item.snippet?.title ?? ''),
      description: item.snippet?.description ?? '',
      thumbnail:
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        '',
      channelTitle: item.snippet?.channelTitle ?? '',
      publishedAt: item.snippet?.publishedAt ?? '',
    }));
};

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
