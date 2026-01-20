'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface DividerWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function DividerWidget({ block, isEditing, onUpdate, onDelete }: DividerWidgetProps) {
  const [style, setStyle] = useState(block.content?.style || 'solid');
  const [width, setWidth] = useState(block.content?.width || 100);
  const [color, setColor] = useState(block.content?.color || '#E5E7EB');

  useEffect(() => {
    setStyle(block.content?.style || 'solid');
    setWidth(block.content?.width || 100);
    setColor(block.content?.color || '#E5E7EB');
  }, [block.content]);

  const handleUpdate = (newStyle?: string, newWidth?: number, newColor?: string) => {
    const updatedStyle = newStyle !== undefined ? newStyle : style;
    const updatedWidth = newWidth !== undefined ? newWidth : width;
    const updatedColor = newColor !== undefined ? newColor : color;
    
    if (newStyle !== undefined) setStyle(newStyle);
    if (newWidth !== undefined) setWidth(newWidth);
    if (newColor !== undefined) setColor(updatedColor);
    
    onUpdate({ 
      ...block, 
      content: { style: updatedStyle, width: updatedWidth, color: updatedColor } 
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Divider</span>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => handleUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (%)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleUpdate(undefined, Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleUpdate(undefined, undefined, e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleUpdate(undefined, undefined, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="#E5E7EB"
              />
            </div>
          </div>
          <div className="pt-2">
            <hr 
              style={{
                borderStyle: style,
                borderWidth: '1px 0 0 0',
                borderColor: color,
                width: `${width}%`,
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const dividerStyle: React.CSSProperties = {
    borderStyle: style,
    borderWidth: '1px 0 0 0',
    borderColor: color,
    width: `${width}%`,
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px auto ${block.styles.margin.bottom}px auto` : 
      '20px auto',
  };

  return (
    <div 
      style={{
        padding: block.styles?.padding ? 
          `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
          undefined,
      }}
      className="divider-widget"
    >
      <hr style={dividerStyle} />
    </div>
  );
}
