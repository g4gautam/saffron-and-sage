import React, { useEffect, useState } from 'react';
import { Play, Timer, AlertCircle } from 'lucide-react';
import { getVideoMetadata, YoutubeMetadata } from '../services/youtubeService';

interface YouTubePlayerProps {
  videoId: string;
  className?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, className }) => {
  const [metadata, setMetadata] = useState<YoutubeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      const data = await getVideoMetadata(videoId);
      setMetadata(data);
      setLoading(false);
    };
    fetchMetadata();
  }, [videoId]);

  if (loading) {
    return (
      <div className={`aspect-video rounded-3xl bg-slate-900 border border-sage/10 animate-pulse flex items-center justify-center ${className}`}>
        <Play size={40} className="text-slate-700" />
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className={`aspect-video rounded-3xl bg-slate-900 border border-red-500/20 flex flex-col items-center justify-center gap-4 text-center p-6 ${className}`}>
        <AlertCircle size={40} className="text-red-500/50" />
        <div>
          <p className="text-white font-bold">Video Unavailable</p>
          <p className="text-slate-500 text-xs">Verify your API key and video ID</p>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className={`aspect-video rounded-3xl overflow-hidden glass shadow-2xl relative ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={metadata.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none"
        />
        <button 
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
        >
          <Play size={16} className="rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <section 
      onClick={() => setIsPlaying(true)}
      className={`relative rounded-3xl overflow-hidden glass shadow-2xl aspect-video group cursor-pointer bg-slate-900 ${className}`}
    >
      <img 
        src={metadata.thumbnail} 
        alt={metadata.title} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-20 h-20 bg-saffron text-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
          <Play size={40} fill="currentColor" className="ml-1" />
        </button>
      </div>
      <div className="absolute top-4 left-6 right-16">
        <h4 className="text-white font-display font-bold text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {metadata.title}
        </h4>
      </div>
      <div className="absolute bottom-4 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
        Watch Masterclass
      </div>
      <div className="absolute bottom-4 right-6 flex items-center gap-2 text-white text-sm font-display font-medium">
        <Timer size={14} className="text-saffron" />
        {metadata.duration}
      </div>
    </section>
  );
};
