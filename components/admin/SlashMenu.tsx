'use client';

import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Heading1, Heading2, List, Image as ImageIcon, Quote } from 'lucide-react';

interface SlashMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
}

interface SlashMenuProps {
  editor: Editor | null;
  onClose: () => void;
}

export default function SlashMenu({ editor, onClose }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: SlashMenuItem[] = [
    {
      id: 'heading1',
      label: 'Heading 1',
      icon: <Heading1 size={18} />,
      command: (editor) => {
        editor.chain().focus().deleteRange({ from: editor.state.selection.$from.pos - 1, to: editor.state.selection.$from.pos }).toggleHeading({ level: 1 }).run();
        onClose();
      },
    },
    {
      id: 'heading2',
      label: 'Heading 2',
      icon: <Heading2 size={18} />,
      command: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Delete the '/' character
        const fromPos = Math.max(0, $from.pos - 1);
        editor.chain().focus().deleteRange({ from: fromPos, to: $from.pos }).toggleHeading({ level: 2 }).run();
        onClose();
      },
    },
    {
      id: 'bulletList',
      label: 'Bullet List',
      icon: <List size={18} />,
      command: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Delete the '/' character
        const fromPos = Math.max(0, $from.pos - 1);
        editor.chain().focus().deleteRange({ from: fromPos, to: $from.pos }).toggleBulletList().run();
        onClose();
      },
    },
    {
      id: 'image',
      label: 'Image',
      icon: <ImageIcon size={18} />,
      command: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Delete the '/' character
        const fromPos = Math.max(0, $from.pos - 1);
        editor.chain().focus().deleteRange({ from: fromPos, to: $from.pos }).run();
        
        // Trigger image modal
        setTimeout(() => {
          const event = new CustomEvent('openImageModal');
          window.dispatchEvent(event);
        }, 10);
        
        onClose();
      },
    },
    {
      id: 'quote',
      label: 'Quote',
      icon: <Quote size={18} />,
      command: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Delete the '/' character
        const fromPos = Math.max(0, $from.pos - 1);
        editor.chain().focus().deleteRange({ from: fromPos, to: $from.pos }).toggleBlockquote().run();
        onClose();
      },
    },
  ];

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Get the DOM position of the cursor
      const coords = editor.view.coordsAtPos($from.pos);
      const editorElement = editor.view.dom;
      const editorRect = editorElement.getBoundingClientRect();
      
      setPosition({
        top: coords.bottom - editorRect.top + window.scrollY + 5,
        left: coords.left - editorRect.left + window.scrollX,
      });
    };

    const handleSlashCommand = (e: CustomEvent) => {
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (menuItems[selectedIndex] && editor) {
          menuItems[selectedIndex].command(editor);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Update position on editor updates
    const handleUpdate = () => {
      updatePosition();
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('slashCommand', handleSlashCommand as EventListener);
    editor.on('update', handleUpdate);
    window.addEventListener('keydown', handleKeyDown);

    // Initial position update
    updatePosition();

    return () => {
      editorElement.removeEventListener('slashCommand', handleSlashCommand as EventListener);
      editor.off('update', handleUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, selectedIndex, menuItems, onClose]);

  if (!editor) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#2c2c2c] rounded-lg shadow-2xl border border-gray-600 overflow-hidden min-w-[280px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => item.command(editor)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-[#3c3c3c] transition-colors ${
              index === selectedIndex ? 'bg-[#3c3c3c]' : ''
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="text-gray-400 flex-shrink-0">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
