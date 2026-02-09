'use client';

import React, { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface HeadingWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function HeadingWidget({ block, isEditing, onUpdate, onDelete }: HeadingWidgetProps) {
  const [text, setText] = useState(block.content?.text || '');
  const [level, setLevel] = useState(block.content?.level || 2);

  useEffect(() => {
    setText(block.content?.text || '');
    setLevel(block.content?.level || 2);
  }, [block.content]);

  const handleUpdate = (newText: string, newLevel?: number) => {
    const updatedLevel = newLevel !== undefined ? newLevel : level;
    setText(newText);
    if (newLevel !== undefined) setLevel(newLevel);
    onUpdate({ 
      ...block, 
      content: { text: newText, level: updatedLevel } 
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 min-h-[80px]">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Heading</span>
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
          <select
            value={level}
            onChange={(e) => handleUpdate(text, Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={1}>H1 - Largest</option>
            <option value={2}>H2 - Large</option>
            <option value={3}>H3 - Medium</option>
            <option value={4}>H4 - Small</option>
            <option value={5}>H5 - Smaller</option>
            <option value={6}>H6 - Smallest</option>
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => handleUpdate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Enter heading text..."
            style={{
              fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
              fontWeight: block.styles?.fontWeight || 'bold',
            }}
          />
        </div>
      </div>
    );
  }

  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const style: React.CSSProperties = {
    color: block.styles?.textColor,
    fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
    fontWeight: block.styles?.fontWeight || 'bold',
    textAlign: block.styles?.textAlign,
    padding: block.styles?.padding ? 
      `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
      undefined,
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px ${block.styles.margin.right}px ${block.styles.margin.bottom}px ${block.styles.margin.left}px` : 
      undefined,
  };

  return (
    <HeadingTag style={style}>
      {text || 'Heading'}
    </HeadingTag>
  );
}
