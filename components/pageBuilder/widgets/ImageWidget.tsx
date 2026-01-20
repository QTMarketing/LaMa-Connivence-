'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface ImageWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function ImageWidget({ block, isEditing, onUpdate, onDelete }: ImageWidgetProps) {
  const [url, setUrl] = useState(block.content?.url || '');
  const [alt, setAlt] = useState(block.content?.alt || '');

  useEffect(() => {
    setUrl(block.content?.url || '');
    setAlt(block.content?.alt || '');
  }, [block.content]);

  const handleUpdate = (newUrl: string, newAlt: string) => {
    setUrl(newUrl);
    setAlt(newAlt);
    onUpdate({ 
      ...block, 
      content: { url: newUrl, alt: newAlt } 
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Image</span>
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
          {url ? (
            <div className="relative w-full h-48 rounded overflow-hidden border border-gray-300 bg-gray-100">
              <Image 
                src={url} 
                alt={alt || 'Preview'} 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50">
              <ImageIcon size={48} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No image selected</p>
            </div>
          )}
          <input
            type="url"
            value={url}
            onChange={(e) => handleUpdate(e.target.value, alt)}
            placeholder="Image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="text"
            value={alt}
            onChange={(e) => handleUpdate(url, e.target.value)}
            placeholder="Alt text (for accessibility)"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
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
    width: block.styles?.width,
    maxWidth: block.styles?.maxWidth,
  };

  return (
    <div style={style} className="image-widget">
      <Image
        src={url}
        alt={alt || ''}
        width={800}
        height={600}
        className="w-full h-auto rounded"
        style={{
          borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : undefined,
        }}
        unoptimized
      />
    </div>
  );
}
