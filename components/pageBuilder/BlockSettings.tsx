'use client';

import { useState } from 'react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface BlockSettingsProps {
  block: PageBuilderBlock;
  onUpdate: (updates: Partial<PageBuilderBlock>) => void;
}

export default function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
  const [localStyles, setLocalStyles] = useState(block.styles || {});

  const updateStyle = (key: string, value: any) => {
    const newStyles = { ...localStyles, [key]: value };
    setLocalStyles(newStyles);
    onUpdate({ styles: newStyles });
  };

  const updatePadding = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const padding = { ...localStyles.padding, [side]: value };
    updateStyle('padding', padding);
  };

  const updateMargin = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const margin = { ...localStyles.margin, [side]: value };
    updateStyle('margin', margin);
  };

  return (
    <div className="space-y-4">
      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={localStyles.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={localStyles.backgroundColor || ''}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {block.type !== 'image' && block.type !== 'video' && block.type !== 'gallery' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={localStyles.textColor || '#000000'}
              onChange={(e) => updateStyle('textColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={localStyles.textColor || ''}
              onChange={(e) => updateStyle('textColor', e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Font Size */}
      {(block.type === 'text' || block.type === 'heading' || block.type === 'button') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size (px)
          </label>
          <input
            type="number"
            value={localStyles.fontSize || ''}
            onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="16"
          />
        </div>
      )}

      {/* Text Align */}
      {(block.type === 'text' || block.type === 'heading' || block.type === 'button') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
          <select
            value={localStyles.textAlign || 'left'}
            onChange={(e) => updateStyle('textAlign', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      )}

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Padding (px)</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Top</label>
            <input
              type="number"
              value={localStyles.padding?.top || 0}
              onChange={(e) => updatePadding('top', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Right</label>
            <input
              type="number"
              value={localStyles.padding?.right || 0}
              onChange={(e) => updatePadding('right', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bottom</label>
            <input
              type="number"
              value={localStyles.padding?.bottom || 0}
              onChange={(e) => updatePadding('bottom', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Left</label>
            <input
              type="number"
              value={localStyles.padding?.left || 0}
              onChange={(e) => updatePadding('left', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Margin (px)</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Top</label>
            <input
              type="number"
              value={localStyles.margin?.top || 0}
              onChange={(e) => updateMargin('top', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Right</label>
            <input
              type="number"
              value={localStyles.margin?.right || 0}
              onChange={(e) => updateMargin('right', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bottom</label>
            <input
              type="number"
              value={localStyles.margin?.bottom || 0}
              onChange={(e) => updateMargin('bottom', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Left</label>
            <input
              type="number"
              value={localStyles.margin?.left || 0}
              onChange={(e) => updateMargin('left', Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Radius (px)
        </label>
        <input
          type="number"
          value={localStyles.borderRadius || 0}
          onChange={(e) => updateStyle('borderRadius', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
    </div>
  );
}
