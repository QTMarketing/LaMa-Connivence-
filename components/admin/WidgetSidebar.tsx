'use client';

import { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { PageBuilderBlock, createBlock } from '@/lib/pageBuilderStorage';

interface WidgetSidebarProps {
  onInsertWidget: (block: PageBuilderBlock) => void;
  isOpen: boolean;
  onClose: () => void;
}

const WIDGET_TYPES = [
  { type: 'heading', label: 'Heading', icon: 'H', description: 'Add a heading' },
  { type: 'text', label: 'Text', icon: 'T', description: 'Add text content' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Add an image' },
  { type: 'button', label: 'Button', icon: '🔘', description: 'Add a button' },
  { type: 'video', label: 'Video', icon: '▶️', description: 'Add a video' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️🖼️', description: 'Add image gallery' },
  { type: 'spacer', label: 'Spacer', icon: '⬜', description: 'Add spacing' },
  { type: 'divider', label: 'Divider', icon: '➖', description: 'Add a divider' },
];

export default function WidgetSidebar({ onInsertWidget, isOpen, onClose }: WidgetSidebarProps) {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, widgetType: string) => {
    setDraggedWidget(widgetType);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('widget-type', widgetType);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleClick = (widgetType: string) => {
    const block = createBlock(widgetType as PageBuilderBlock['type']);
    onInsertWidget(block);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">Widgets</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-600 mb-4">
          Drag widgets into your content or click to insert at cursor position
        </p>
        
        {WIDGET_TYPES.map(widget => (
          <div
            key={widget.type}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.type)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(widget.type)}
            className={`p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50/50 transition-all ${
              draggedWidget === widget.type ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <GripVertical className="text-gray-400 mt-1" size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{widget.icon}</span>
                  <span className="font-semibold text-gray-900">{widget.label}</span>
                </div>
                <p className="text-xs text-gray-600">{widget.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
