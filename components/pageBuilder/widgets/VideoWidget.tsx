'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2, Play } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface VideoWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function VideoWidget({ block, isEditing, onUpdate, onDelete }: VideoWidgetProps) {
  const [url, setUrl] = useState(block.content?.url || '');
  const [autoplay, setAutoplay] = useState(block.content?.autoplay || false);
  const [loop, setLoop] = useState(block.content?.loop || false);
  const [controls, setControls] = useState(block.content?.controls !== false);

  useEffect(() => {
    setUrl(block.content?.url || '');
    setAutoplay(block.content?.autoplay || false);
    setLoop(block.content?.loop || false);
    setControls(block.content?.controls !== false);
  }, [block.content]);

  const handleUpdate = () => {
    onUpdate({ 
      ...block, 
      content: { url, autoplay, loop, controls } 
    });
  };

  const getVideoEmbedUrl = (videoUrl: string) => {
    // YouTube
    if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
      const youtubeId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}${autoplay ? '?autoplay=1' : ''}${loop ? '&loop=1&playlist=' + youtubeId : ''}`;
      }
    }
    // Vimeo
    if (videoUrl.includes('vimeo.com/')) {
      const vimeoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}${autoplay ? '?autoplay=1' : ''}${loop ? '&loop=1' : ''}`;
      }
    }
    return videoUrl;
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Video</span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button 
            className="p-1.5 hover:bg-blue-200 rounded bg-white shadow-sm"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 hover:bg-red-200 rounded bg-white shadow-sm text-red-600"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="mt-8 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              handleUpdate();
            }}
            placeholder="YouTube, Vimeo URL, or direct video URL"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => {
                  setAutoplay(e.target.checked);
                  handleUpdate();
                }}
                className="rounded"
              />
              Autoplay
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => {
                  setLoop(e.target.checked);
                  handleUpdate();
                }}
                className="rounded"
              />
              Loop
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={controls}
                onChange={(e) => {
                  setControls(e.target.checked);
                  handleUpdate();
                }}
                className="rounded"
              />
              Show Controls
            </label>
          </div>
          {url && (
            <div className="mt-2 relative w-full aspect-video bg-gray-900 rounded overflow-hidden">
              {(url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) ? (
                <iframe
                  src={getVideoEmbedUrl(url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={url}
                  controls={controls}
                  autoPlay={autoplay}
                  loop={loop}
                  className="w-full h-full"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!url) return null;

  const style: React.CSSProperties = {
    padding: block.styles?.padding ? 
      `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
      undefined,
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px ${block.styles.margin.right}px ${block.styles.margin.bottom}px ${block.styles.margin.left}px` : 
      undefined,
    borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : undefined,
  };

  return (
    <div style={style} className="video-widget">
      <div className="relative w-full aspect-video bg-gray-900 rounded overflow-hidden">
        {(url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) ? (
          <iframe
            src={getVideoEmbedUrl(url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
