'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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

interface EditorBlockMenuProps {
  editor: Editor | null;
}

export default function EditorBlockMenu({ editor }: EditorBlockMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Track editor selection and position
  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Check visibility conditions:
      // 1. Selection is empty (cursor is blinking)
      // 2. Parent node is a paragraph
      // 3. NOT in an image node
      // Note: We show it even when there's content in the paragraph
      const isEmpty = selection.empty;
      const parentNode = $from.parent;
      const isParagraph = parentNode.type.name === 'paragraph';
      
      // Check if we're inside an image or other block nodes (not paragraph)
      const isInImage = parentNode.type.name === 'image' || 
                       parentNode.type.name === 'customImage' ||
                       $from.node().type.name === 'image' ||
                       $from.node().type.name === 'customImage';
      
      // Check ancestors to ensure we're not inside an image node
      let isInsideImage = false;
      for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        if (node.type.name === 'image' || node.type.name === 'customImage') {
          isInsideImage = true;
          break;
        }
      }
      
      // Show menu when cursor is in a paragraph (empty or with content), but not in images
      if (isEmpty && isParagraph && !isInImage && !isInsideImage) {
        const { view } = editor;
        const coords = view.coordsAtPos($from.pos);
        
        // coords are already in screen coordinates (relative to viewport)
        // Position menu above the cursor, centered horizontally
        const menuButtonWidth = 28; // w-7 = 28px
        const menuButtonHeight = 28;
        const expandedMenuWidth = 300;
        const expandedMenuHeight = 250; // Estimated height
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate position - center horizontally above cursor
        let menuTop = coords.top - 10; // 10px above cursor
        let menuLeft = coords.left; // Cursor horizontal position (this is already in screen coordinates)
        
        // Account for menu width (we'll center it) - use collapsed size for initial positioning
        const currentMenuWidth = menuButtonWidth;
        // Center the button horizontally on the cursor
        menuLeft = menuLeft - (currentMenuWidth / 2);
        
        // Horizontal boundary checks - prevent overflow
        const padding = 10; // Minimum distance from viewport edges
        if (menuLeft < padding) {
          menuLeft = padding;
        } else if (menuLeft + currentMenuWidth > viewportWidth - padding) {
          menuLeft = viewportWidth - currentMenuWidth - padding;
        }
        
        // Vertical boundary checks
        // If too close to top, show below cursor instead
        const currentMenuHeight = menuButtonHeight;
        if (menuTop < padding) {
          menuTop = coords.bottom + 10; // Show below cursor
        } else if (menuTop + currentMenuHeight > viewportHeight - padding) {
          // If too close to bottom, move it up
          menuTop = Math.max(padding, coords.top - currentMenuHeight - 10);
        }
        
        // Convert to scroll-relative coordinates for fixed positioning
        // Note: coords.left is already in viewport coordinates, so we add scrollX
        setPosition({
          top: menuTop + window.scrollY,
          left: menuLeft + window.scrollX,
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
  }, [editor]); // Track editor changes only

  // Recalculate position when menu expands/collapses to adjust for size changes
  useEffect(() => {
    if (!editor || !isVisible) return;

    const updatePositionForExpanded = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      const isEmpty = selection.empty;
      const isParagraph = $from.parent.type.name === 'paragraph';
      
      // Show menu when cursor is in a paragraph (empty or with content)
      if (isEmpty && isParagraph) {
        const { view } = editor;
        const coords = view.coordsAtPos($from.pos);
        
        const menuButtonWidth = 28;
        const expandedMenuWidth = 300;
        const expandedMenuHeight = 250;
        const menuButtonHeight = 28;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let menuTop = coords.top - 10;
        let menuLeft = coords.left;
        
        const currentMenuWidth = isExpanded ? expandedMenuWidth : menuButtonWidth;
        menuLeft = menuLeft - (currentMenuWidth / 2);
        
        const padding = 10;
        if (menuLeft < padding) {
          menuLeft = padding;
        } else if (menuLeft + currentMenuWidth > viewportWidth - padding) {
          menuLeft = viewportWidth - currentMenuWidth - padding;
        }
        
        const currentMenuHeight = isExpanded ? expandedMenuHeight : menuButtonHeight;
        if (menuTop < padding) {
          menuTop = coords.bottom + 10;
        } else if (menuTop + currentMenuHeight > viewportHeight - padding) {
          menuTop = Math.max(padding, coords.top - currentMenuHeight - 10);
        }
        
        setPosition({
          top: menuTop + window.scrollY,
          left: menuLeft + window.scrollX,
        });
      }
    };

    updatePositionForExpanded();
  }, [editor, isVisible, isExpanded]); // Recalculate when expanded state changes

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

  // Define handler functions (these are stable references)
  const handleInsertText = () => {
    if (editor) {
      editor.chain().focus().insertContent('<p></p>').run();
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleInsertHeading = () => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleInsertImage = () => {
    if (editor) {
      // Trigger image upload modal
      const event = new CustomEvent('openImageModal');
      window.dispatchEvent(event);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleInsertList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleInsertSeparator = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run();
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const handleInsertQuote = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  // Define menu items
  const menuItems = useMemo(() => [
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
  ], [editor]); // Only recreate if editor changes

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    return menuItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery]);

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
        // Position is already calculated centered, no transform needed
      }}
    >
      {!isExpanded ? (
        // Initial State: Small square button (28px) with black background and white Plus icon
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(true);
            setSearchQuery('');
          }}
          className="w-7 h-7 bg-black rounded text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
          aria-label="Add block"
        >
          <Plus size={16} />
        </button>
      ) : (
        // Clicked State: Block Picker card (white card, shadow, grid of icons)
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
