'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface TextWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function TextWidget({ block, isEditing, onUpdate, onDelete }: TextWidgetProps) {
  const [content, setContent] = useState(block.content?.text || '');

  useEffect(() => {
    setContent(block.content?.text || '');
  }, [block.content?.text]);

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    onUpdate({
      ...block,
      content: { text: newContent }
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 min-h-[100px]">
        {/* Drag Handle */}
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Text Block</span>
        </div>

        {/* Edit Controls */}
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

        {/* Content Editor */}
        <textarea
          value={content}
          onChange={(e) => handleUpdate(e.target.value)}
          className="w-full min-h-[100px] mt-8 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Enter text content..."
          style={{
            color: block.styles?.textColor,
            fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
            textAlign: block.styles?.textAlign,
          }}
        />
      </div>
    );
  }

  // Preview/Render Mode
  const style: React.CSSProperties = {
    color: block.styles?.textColor,
    fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
    fontWeight: block.styles?.fontWeight,
    textAlign: block.styles?.textAlign,
    padding: block.styles?.padding ? 
      `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
      undefined,
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px ${block.styles.margin.right}px ${block.styles.margin.bottom}px ${block.styles.margin.left}px` : 
      undefined,
    backgroundColor: block.styles?.backgroundColor,
    borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : undefined,
  };

  return (
    <div 
      className="text-widget prose prose-sm sm:prose lg:prose-lg max-w-none"
      style={style}
      dangerouslySetInnerHTML={{ __html: content || '<p></p>' }}
    />
  );
}
