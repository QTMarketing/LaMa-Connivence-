'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface GalleryWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function GalleryWidget({ block, isEditing, onUpdate, onDelete }: GalleryWidgetProps) {
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>(block.content?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    setImages(block.content?.images || []);
  }, [block.content?.images]);

  const addImage = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...images, { url: newImageUrl.trim(), alt: '' }];
      setImages(updatedImages);
      setNewImageUrl('');
      onUpdate({ 
        ...block, 
        content: { images: updatedImages } 
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpdate({ 
      ...block, 
      content: { images: updatedImages } 
    });
  };

  const updateImageAlt = (index: number, alt: string) => {
    const updatedImages = images.map((img, i) => i === index ? { ...img, alt } : img);
    setImages(updatedImages);
    onUpdate({ 
      ...block, 
      content: { images: updatedImages } 
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Gallery</span>
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
        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
              placeholder="Image URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={addImage}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group/item">
                  <div className="relative w-full aspect-square rounded overflow-hidden border border-gray-300 bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => updateImageAlt(index, e.target.value)}
                    placeholder="Alt text"
                    className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded">
              <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No images added yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (images.length === 0) return null;

  const style: React.CSSProperties = {
    padding: block.styles?.padding ? 
      `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
      undefined,
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px ${block.styles.margin.right}px ${block.styles.margin.bottom}px ${block.styles.margin.left}px` : 
      undefined,
  };

  return (
    <div style={style} className="gallery-widget">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative w-full aspect-square rounded overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
