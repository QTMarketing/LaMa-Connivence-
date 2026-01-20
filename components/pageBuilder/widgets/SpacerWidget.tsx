'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface SpacerWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function SpacerWidget({ block, isEditing, onUpdate, onDelete }: SpacerWidgetProps) {
  const [height, setHeight] = useState(block.content?.height || 50);

  useEffect(() => {
    setHeight(block.content?.height || 50);
  }, [block.content?.height]);

  const handleUpdate = (newHeight: number) => {
    setHeight(newHeight);
    onUpdate({ 
      ...block, 
      content: { height: newHeight },
      styles: { ...block.styles, height: `${newHeight}px` }
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Spacer</span>
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
          <label className="block text-sm font-medium text-gray-700">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleUpdate(Number(e.target.value))}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div 
            className="w-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500"
            style={{ height: `${height}px`, minHeight: '20px' }}
          >
            {height}px
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        height: block.styles?.height || `${height}px`,
        minHeight: block.styles?.height || `${height}px`,
      }} 
      className="spacer-widget"
    />
  );
}
