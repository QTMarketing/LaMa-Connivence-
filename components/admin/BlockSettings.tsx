'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Image as ImageIcon } from 'lucide-react';

interface BlockSettingsProps {
  editor: Editor | null;
  selectedBlock: {
    type: string;
    node: any;
    position: number;
  } | null;
}

export default function BlockSettings({ editor, selectedBlock }: BlockSettingsProps) {
  const [altText, setAltText] = useState('');
  const [imageWidth, setImageWidth] = useState(100);
  const [roundedCorners, setRoundedCorners] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [dropCap, setDropCap] = useState(false);

  useEffect(() => {
    if (!selectedBlock || !editor) {
      return;
    }

    if (selectedBlock.type === 'image' || selectedBlock.type === 'customImage') {
      const node = selectedBlock.node;
      setAltText(node.attrs.alt || '');
      const width = node.attrs.width || '100%';
      setImageWidth(width === '100%' ? 100 : parseInt(width) || 100);
      // Check if image has rounded corners (we'll add this as a custom attribute)
      setRoundedCorners(node.attrs.roundedCorners || false);
    } else if (selectedBlock.type === 'paragraph' || selectedBlock.type === 'text') {
      const node = selectedBlock.node;
      // Get font size from node attributes or default
      setFontSize(node.attrs.fontSize || 16);
      setDropCap(node.attrs.dropCap || false);
    }
  }, [selectedBlock, editor]);

  const updateImageAttributes = (attrs: Record<string, any>) => {
    if (!editor || !selectedBlock) return;

    const { state } = editor;
    const { tr } = state;
    const node = state.doc.nodeAt(selectedBlock.position);

    if (node && (node.type.name === 'image' || node.type.name === 'customImage')) {
      tr.setNodeMarkup(selectedBlock.position, undefined, {
        ...node.attrs,
        ...attrs,
      });
      editor.view.dispatch(tr);
      
      // Trigger update to sync with parent component
      editor.chain().focus().run();
    }
  };

  const updateTextAttributes = (attrs: Record<string, any>) => {
    if (!editor || !selectedBlock) return;

    const { state } = editor;
    const { tr } = state;
    const node = state.doc.nodeAt(selectedBlock.position);

    if (node && (node.type.name === 'paragraph' || node.type.name === 'heading')) {
      tr.setNodeMarkup(selectedBlock.position, undefined, {
        ...node.attrs,
        ...attrs,
      });
      editor.view.dispatch(tr);
      
      // Trigger update to sync with parent component
      editor.chain().focus().run();
    }
  };

  if (!selectedBlock) {
    return (
      <div className="text-sm text-gray-500 p-4">
        <p>Click on a block in the editor to see its settings.</p>
      </div>
    );
  }

  if (selectedBlock.type === 'image' || selectedBlock.type === 'customImage') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ImageIcon size={16} />
            Image Settings
          </h3>
          
          {/* Alt Text */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                updateImageAttributes({ alt: e.target.value });
              }}
              placeholder="Describe the image"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe the image for accessibility and SEO.
            </p>
          </div>

          {/* Width Slider */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Width: {imageWidth}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={imageWidth}
              onChange={(e) => {
                const width = parseInt(e.target.value);
                setImageWidth(width);
                updateImageAttributes({ width: `${width}%` });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Rounded Corners Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={roundedCorners}
                onChange={(e) => {
                  setRoundedCorners(e.target.checked);
                  updateImageAttributes({ roundedCorners: e.target.checked });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Rounded Corners</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (selectedBlock.type === 'paragraph' || selectedBlock.type === 'text') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Typography Settings
          </h3>
          
          {/* Font Size Slider */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={fontSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setFontSize(size);
                updateTextAttributes({ fontSize: size });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>48px</span>
            </div>
          </div>

          {/* Drop Cap Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dropCap}
                onChange={(e) => {
                  setDropCap(e.target.checked);
                  updateTextAttributes({ dropCap: e.target.checked });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Drop Cap</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Make the first letter larger and styled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500 p-4">
      <p>Settings for {selectedBlock.type} blocks are not available yet.</p>
    </div>
  );
}
