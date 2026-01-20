'use client';

import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { createPortal } from 'react-dom';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Link as LinkIcon, Heading1, Heading2
} from 'lucide-react';

interface BubbleMenuProps {
  editor: Editor | null;
}

export default function BubbleMenuComponent({ editor }: BubbleMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { state } = editor;
      const { selection } = state;
      const { from, to } = selection;

      // Only show if there's a text selection (not empty)
      if (from !== to && !selection.empty) {
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        
        // Position the menu above the selection
        const editorElement = view.dom;
        const editorRect = editorElement.getBoundingClientRect();
        
        setPosition({
          top: start.top - editorRect.top + window.scrollY - 50,
          left: (start.left + end.left) / 2 - editorRect.left + window.scrollX,
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleSelectionUpdate = () => {
      updatePosition();
    };

    const handleUpdate = () => {
      updatePosition();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('update', handleSelectionUpdate);

    // Initial check
    updatePosition();

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('update', handleSelectionUpdate);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed z-50 flex items-center gap-1 bg-gray-900 text-white rounded-lg shadow-lg p-1 border border-gray-700"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-700' : ''
        }`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-700' : ''
        }`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-6 bg-gray-600 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-700' : ''
        }`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-700' : ''
        }`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>
      <div className="w-px h-6 bg-gray-600 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-700' : ''
        }`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('orderedList') ? 'bg-gray-700' : ''
        }`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('blockquote') ? 'bg-gray-700' : ''
        }`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <div className="w-px h-6 bg-gray-600 mx-1" />
      <button
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-800 transition-colors ${
          editor.isActive('link') ? 'bg-gray-700' : ''
        }`}
        title="Add Link"
      >
        <LinkIcon size={16} />
      </button>
    </div>
  );

  // Render using portal to ensure it's above everything
  if (typeof window !== 'undefined') {
    return createPortal(menuContent, document.body);
  }

  return null;
}
