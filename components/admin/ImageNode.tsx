'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Resizable } from 're-resizable';
import { useState, useEffect } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, X } from 'lucide-react';

interface ImageNodeProps {
  node: {
    attrs: {
      src: string;
      alt: string;
      title: string;
      width: string;
      textAlign: 'left' | 'center' | 'right';
    };
  };
  updateAttributes: (attrs: Partial<ImageNodeProps['node']['attrs']>) => void;
  selected: boolean;
  deleteNode: () => void;
  extension: any;
  getPos: () => number;
  editor: any;
}

export default function ImageNode({ node, updateAttributes, selected, deleteNode, getPos, editor }: ImageNodeProps) {
  const { src, alt, title, width, textAlign } = node.attrs;
  const [showAltModal, setShowAltModal] = useState(false);
  const [altText, setAltText] = useState(alt || '');
  const [titleText, setTitleText] = useState(title || '');

  const handleDelete = () => {
    if (editor && typeof getPos === 'function') {
      const pos = getPos();
      editor.chain().focus().setTextSelection(pos).deleteSelection().run();
    } else if (deleteNode) {
      deleteNode();
    }
  };

  useEffect(() => {
    setAltText(alt || '');
    setTitleText(title || '');
  }, [alt, title]);

  const handleResize = (e: any, direction: any, ref: any, d: any) => {
    const newWidth = ref.style.width;
    // Convert to percentage or pixel value
    const widthValue = newWidth.includes('%') ? newWidth : `${parseInt(newWidth)}px`;
    updateAttributes({ width: widthValue });
  };

  const handleAlign = (align: 'left' | 'center' | 'right') => {
    updateAttributes({ textAlign: align });
  };

  const handleAltTextSave = () => {
    updateAttributes({ alt: altText, title: titleText });
    setShowAltModal(false);
  };

  const widthValue = width === '100%' ? '100%' : width.includes('%') ? width : `${width}px`;

  const getWrapperStyles = () => {
    return {
      display: 'block',
      width: '100%',
      margin: '16px 0',
    };
  };

  const getContainerStyles = () => {
    switch (textAlign) {
      case 'center':
        return { 
          margin: '0 auto',
          display: 'block',
          width: widthValue,
          maxWidth: '100%',
        };
      case 'right':
        return { 
          marginLeft: 'auto',
          marginRight: '0',
          display: 'block',
          width: widthValue,
          maxWidth: '100%',
        };
      case 'left':
      default:
        return { 
          marginLeft: '0',
          marginRight: 'auto',
          display: 'block',
          width: widthValue,
          maxWidth: '100%',
        };
    }
  };

  return (
    <NodeViewWrapper
      className={`image-node-wrapper ${selected ? 'selected' : ''}`}
      style={getWrapperStyles()}
    >
      <div 
        className="relative" 
        style={getContainerStyles()}
      >
        {/* Floating Toolbar - Shows when selected */}
        {selected && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex items-center gap-1">
            <button
              onClick={() => handleAlign('left')}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => handleAlign('center')}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => handleAlign('right')}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={() => setShowAltModal(true)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
              title="Set Alt Text"
            >
              <ImageIcon size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors"
              title="Delete Image"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Resizable Image Container */}
        <Resizable
          size={{ width: widthValue, height: 'auto' }}
          onResizeStop={handleResize}
          minWidth={100}
          maxWidth="100%"
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: {
              right: '-5px',
              width: '10px',
              height: '100%',
              cursor: 'ew-resize',
            },
            bottomRight: {
              right: '-5px',
              bottom: '-5px',
              width: '10px',
              height: '10px',
              cursor: 'nwse-resize',
            },
          }}
          handleClasses={{
            right: 'resize-handle-right',
            bottomRight: 'resize-handle-corner',
          }}
        >
          <div
            className={`image-container ${selected ? 'selected' : ''}`}
            style={{ width: '100%', height: '100%' }}
          >
            <img
              src={src}
              alt={alt || ''}
              title={title || alt || ''}
              className="w-full h-auto rounded"
              style={{ display: 'block' }}
              draggable={false}
            />
          </div>
        </Resizable>

        {/* Alt Text Modal */}
        {showAltModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Image Settings</h3>
                <button
                  onClick={() => setShowAltModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Alt text helps screen readers understand your images
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (tooltip text)
                  </label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Image title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Title appears on hover
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    onClick={() => setShowAltModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAltTextSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </NodeViewWrapper>
  );
}
