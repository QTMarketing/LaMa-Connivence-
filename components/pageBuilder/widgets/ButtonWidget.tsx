'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface ButtonWidgetProps {
  block: PageBuilderBlock;
  isEditing: boolean;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
}

export default function ButtonWidget({ block, isEditing, onUpdate, onDelete }: ButtonWidgetProps) {
  const [text, setText] = useState(block.content?.text || 'Click Here');
  const [url, setUrl] = useState(block.content?.url || '');
  const [target, setTarget] = useState(block.content?.target || '_self');

  useEffect(() => {
    setText(block.content?.text || 'Click Here');
    setUrl(block.content?.url || '');
    setTarget(block.content?.target || '_self');
  }, [block.content]);

  const handleUpdate = (newText?: string, newUrl?: string, newTarget?: string) => {
    const updatedText = newText !== undefined ? newText : text;
    const updatedUrl = newUrl !== undefined ? newUrl : url;
    const updatedTarget = newTarget !== undefined ? newTarget : target;
    
    if (newText !== undefined) setText(newText);
    if (newUrl !== undefined) setUrl(newUrl);
    if (newTarget !== undefined) setTarget(newTarget);
    
    onUpdate({ 
      ...block, 
      content: { text: updatedText, url: updatedUrl, target: updatedTarget } 
    });
  };

  if (isEditing) {
    return (
      <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">Button</span>
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
            type="text"
            value={text}
            onChange={(e) => handleUpdate(e.target.value)}
            placeholder="Button text"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => handleUpdate(undefined, e.target.value)}
            placeholder="Button URL"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <select
            value={target}
            onChange={(e) => handleUpdate(undefined, undefined, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="_self">Same Window</option>
            <option value="_blank">New Window</option>
          </select>
          <div className="mt-2">
            <button
              disabled
              className="px-4 py-2 rounded text-white font-medium"
              style={{
                backgroundColor: block.styles?.backgroundColor || '#3B82F6',
                color: block.styles?.textColor || '#FFFFFF',
                padding: block.styles?.padding ? 
                  `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
                  '12px 24px',
                borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : '6px',
              }}
            >
              {text || 'Button'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: block.styles?.backgroundColor || '#3B82F6',
    color: block.styles?.textColor || '#FFFFFF',
    padding: block.styles?.padding ? 
      `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : 
      '12px 24px',
    borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : '6px',
    fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
    fontWeight: block.styles?.fontWeight || 'medium',
    textAlign: block.styles?.textAlign || 'center',
    margin: block.styles?.margin ? 
      `${block.styles.margin.top}px ${block.styles.margin.right}px ${block.styles.margin.bottom}px ${block.styles.margin.left}px` : 
      undefined,
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer',
    border: block.styles?.border ? 
      `${block.styles.border.width}px ${block.styles.border.style} ${block.styles.border.color}` : 
      'none',
  };

  if (url) {
    if (url.startsWith('http') || url.startsWith('//')) {
      return (
        <a href={url} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} style={buttonStyle}>
          {text || 'Button'}
        </a>
      );
    }
    return (
      <Link href={url} style={buttonStyle}>
        {text || 'Button'}
      </Link>
    );
  }

  return (
    <button style={buttonStyle} disabled>
      {text || 'Button'}
    </button>
  );
}
