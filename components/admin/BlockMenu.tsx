'use client';

import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { createPortal } from 'react-dom';
import { 
  Type, 
  Heading1, 
  Image as ImageIcon, 
  List, 
  Minus, 
  Quote, 
  Plus,
  Search
} from 'lucide-react';

interface BlockMenuProps {
  editor: Editor | null;
}

export default function BlockMenu({ editor }: BlockMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      const currentLine = $from.parent;
      
      // Only show when in an empty paragraph at the start
      const isEmptyParagraph = 
        currentLine.type.name === 'paragraph' && 
        currentLine.content.size === 0 &&
        $from.parentOffset === 0;

      if (isEmptyParagraph) {
        const { view } = editor;
        const coords = view.coordsAtPos($from.pos);
        const editorElement = view.dom;
        const editorRect = editorElement.getBoundingClientRect();
        
        // Position to the left of the cursor
        setPosition({
          top: coords.top - editorRect.top + window.scrollY,
          left: coords.left - editorRect.left + window.scrollX - 40, // 40px to the left
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
        setSearchQuery('');
      }
    };

    const handleSelectionUpdate = () => {
      updatePosition();
    };

    const handleUpdate = () => {
      updatePosition();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('update', handleUpdate);
    
    // Initial check
    updatePosition();

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  const handleInsertText = () => {
    if (editor) {
      editor.chain().focus().insertContent('<p></p>').run();
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const handleInsertHeading = () => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const handleInsertImage = () => {
    if (editor) {
      // Trigger image upload modal
      const event = new CustomEvent('openImageModal');
      window.dispatchEvent(event);
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const handleInsertList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const handleInsertSeparator = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run();
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const handleInsertQuote = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
      setIsExpanded(false);
      expandedRef.current = false;
    }
  };

  const menuItems = [
    {
      id: 'text',
      label: 'Text',
      icon: Type,
      action: handleInsertText,
    },
    {
      id: 'heading',
      label: 'Heading',
      icon: Heading1,
      action: handleInsertHeading,
    },
    {
      id: 'image',
      label: 'Image',
      icon: ImageIcon,
      action: handleInsertImage,
    },
    {
      id: 'list',
      label: 'List',
      icon: List,
      action: handleInsertList,
    },
    {
      id: 'separator',
      label: 'Separator',
      icon: Minus,
      action: handleInsertSeparator,
    },
    {
      id: 'quote',
      label: 'Quote',
      icon: Quote,
      action: handleInsertQuote,
    },
  ];

  // Filter items based on search query
  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside to close expanded menu
  useEffect(() => {
    if (!isExpanded || !isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isVisible]);

  if (!editor || !isVisible || typeof window === 'undefined') {
    return null;
  }

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-50%)',
      }}
    >
      {!isExpanded ? (
        // Collapsed State: Black square button with Plus icon
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(true);
            setSearchQuery('');
          }}
          className="w-6 h-6 bg-black rounded text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
          aria-label="Add block"
        >
          <Plus size={14} />
        </button>
      ) : (
        // Expanded State: Popover Card with search and grid
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-[300px] overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsExpanded(false);
                    setSearchQuery('');
                    editor.chain().focus().run();
                  } else if (e.key === 'Enter' && filteredItems.length > 0) {
                    // Select first filtered item on Enter
                    e.preventDefault();
                    filteredItems[0].action();
                  }
                }}
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Grid of Items */}
          <div className="p-3">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        item.action();
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-md hover:bg-gray-100 transition-colors group"
                      aria-label={item.label}
                    >
                      <IconComponent 
                        size={24} 
                        className="text-gray-700 group-hover:text-gray-900 mb-1"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                No blocks found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render using portal to ensure it's above everything
  return createPortal(menuContent, document.body);
}
