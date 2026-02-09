'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomImageExtension } from '@/lib/customImageExtension';
import { SlashCommand } from '@/lib/slashCommandExtension';
import { DraggableBlocks } from '@/lib/draggableBlocksExtension';
import { 
  Undo, Redo, Image as ImageIcon, LayoutGrid, X
} from 'lucide-react';
import { WidgetExtension } from '@/lib/tiptapWidgetExtension';
import WidgetSidebar from './WidgetSidebar';
import InlineWidgetEditor from './InlineWidgetEditor';
import ImageUploadModal from './ImageUploadModal';
import SlashMenu from './SlashMenu';
import BubbleMenuComponent from './BubbleMenu';
import BlockMenu from './BlockMenu';
import EditorBlockMenu from './EditorBlockMenu';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';
import { Editor } from '@tiptap/react';
import type { Node as ProseMirrorNode } from '@tiptap/core';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onBlockSelect?: (block: { type: string; node: any; position: number } | null) => void;
  editorRef?: (editor: Editor | null) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Type / to choose a block', onBlockSelect, editorRef: setEditorRef, title, onTitleChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showWidgetSidebar, setShowWidgetSidebar] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [editingWidget, setEditingWidget] = useState<{ block: PageBuilderBlock; nodePos: number } | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Type / to choose a block',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      SlashCommand,
      WidgetExtension,
      DraggableBlocks,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-full',
      },
      handleDrop: (view, event, slice, moved) => {
        // Handle image file drops directly into editor
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const { state, dispatch } = view;
              const { selection } = state;
              const image = state.schema.nodes.image.create({
                src: base64String,
                alt: '',
              });
              const transaction = state.tr.replaceSelectionWith(image);
              dispatch(transaction);
              // Trigger onChange after a brief delay to ensure DOM is updated
              setTimeout(() => {
                const html = view.dom.innerHTML;
                onChange(html);
              }, 0);
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        // Handle image paste from clipboard
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                const { state, dispatch } = view;
                const image = state.schema.nodes.customImage.create({
                  src: base64String,
                  alt: '',
                  width: '100%',
                  textAlign: 'left',
                });
                const transaction = state.tr.replaceSelectionWith(image);
                dispatch(transaction);
                // Trigger onChange after a brief delay to ensure DOM is updated
                setTimeout(() => {
                  const html = view.dom.innerHTML;
                  onChange(html);
                }, 0);
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  // Set up slash command handler
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    
    const handleSlashCommand = (e: CustomEvent) => {
      setShowSlashMenu(true);
    };

    const checkForSlash = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Get text before cursor in current paragraph
      const paragraph = $from.parent;
      const textBefore = paragraph.textBetween(0, $from.parentOffset);
      
      // Check if the last character is '/'
      if (textBefore.endsWith('/')) {
        // Check if we're at the start of a paragraph or after a space/newline
        const isAtStart = $from.parentOffset === 1; // Just after '/'
        const textBeforeSlash = textBefore.slice(0, -1);
        const isAfterSpace = textBeforeSlash === '' || textBeforeSlash.endsWith(' ') || textBeforeSlash.endsWith('\n');
        
        if (isAfterSpace || isAtStart) {
          setShowSlashMenu(true);
        } else {
          setShowSlashMenu(false);
        }
      } else if (showSlashMenu) {
        // If '/' is not the last character, close the menu
        setShowSlashMenu(false);
      }
    };

    const handleUpdate = () => {
      checkForSlash();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close menu on Escape
      if (e.key === 'Escape' && showSlashMenu) {
        e.preventDefault();
        setShowSlashMenu(false);
      }
    };

    editorElement.addEventListener('slashCommand', handleSlashCommand as EventListener);
    editor.on('update', handleUpdate);
    window.addEventListener('keydown', handleKeyDown);

    // Initial check
    checkForSlash();

    return () => {
      editorElement.removeEventListener('slashCommand', handleSlashCommand as EventListener);
      editor.off('update', handleUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, showSlashMenu]);

  // Expose editor instance to parent
  useEffect(() => {
    if (editor && setEditorRef) {
      setEditorRef(editor);
    }
  }, [editor, setEditorRef]);

  // Auto-resize title textarea
  useEffect(() => {
    if (title !== undefined && titleTextareaRef.current) {
      const textarea = titleTextareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [title]);

  // Set up block selection handler
  useEffect(() => {
    if (!editor || !onBlockSelect) return;

    const handleSelectionUpdate = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Find the node at the cursor
      let selectedNode = null;
      let selectedPos = -1;
      let selectedType = '';
      
      // Check if we're in a specific node type
      const nodeTypes = ['paragraph', 'heading', 'image', 'customImage', 'blockquote', 'bulletList', 'orderedList'];
      
      for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth);
        const pos = $from.before(depth);
        
        if (nodeTypes.includes(node.type.name)) {
          selectedNode = node;
          selectedPos = pos;
          selectedType = node.type.name;
          break;
        }
      }
      
      // If no specific node found, check top-level nodes
      if (!selectedNode) {
        state.doc.descendants((node, pos) => {
          const resolvedPos = state.doc.resolve(pos);
          if (resolvedPos.depth === 1) {
            // Check if cursor is within this node
            if (pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
              selectedNode = node;
              selectedPos = pos;
              selectedType = node.type.name;
              return false;
            }
          }
        });
      }
      
      if (selectedNode && selectedPos >= 0) {
        // Map node types to block types
        let blockType = selectedType;
        if (selectedType === 'customImage' || selectedType === 'image') {
          blockType = 'image';
        } else if (selectedType === 'paragraph') {
          blockType = 'text';
        }
        
        onBlockSelect({
          type: blockType,
          node: selectedNode,
          position: selectedPos,
        });
      } else {
        onBlockSelect(null);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('update', handleSelectionUpdate);
    
    // Initial selection
    handleSelectionUpdate();

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('update', handleSelectionUpdate);
    };
  }, [editor, onBlockSelect]);

  // Handle image modal opening from slash menu
  useEffect(() => {
    const handleOpenImageModal = () => {
      setShowImageModal(true);
    };

    window.addEventListener('openImageModal', handleOpenImageModal);
    return () => {
      window.removeEventListener('openImageModal', handleOpenImageModal);
    };
  }, []);

  // Set up widget click handler after editor is initialized
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const widgetElement = target.closest('[data-type="widget"]');
      
      if (widgetElement) {
        e.preventDefault();
        e.stopPropagation();
        
        const blockDataStr = widgetElement.getAttribute('data-block');
        if (blockDataStr) {
          try {
            const blockData = JSON.parse(blockDataStr) as PageBuilderBlock;
            const { state } = editor;
            const { doc } = state;
            let nodePos = -1;
            
            // Find the actual widget node position
            doc.nodesBetween(0, doc.content.size, (node, position) => {
              if (node.type.name === 'widget') {
                const nodeBlockData = node.attrs.blockData as PageBuilderBlock;
                if (nodeBlockData && nodeBlockData.id === blockData.id) {
                  nodePos = position;
                  return false;
                }
              }
            });
            
            if (nodePos >= 0) {
              setEditingWidget({ block: blockData, nodePos });
            }
          } catch (err) {
            console.error('Error parsing widget data:', err);
          }
        }
        return;
      }

      // Check for image clicks (double-click to edit)
      if (target.tagName === 'IMG' && e.detail === 2) {
        e.preventDefault();
        e.stopPropagation();
        
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Find image node at cursor
        let imageNode: ProseMirrorNode | null = null;
        let imagePos = -1;
        
        state.doc.nodesBetween(Math.max(0, $from.pos - 100), Math.min(state.doc.content.size, $from.pos + 100), (node, pos) => {
          if (node.type.name === 'customImage') {
            imageNode = node;
            imagePos = pos;
            return false;
          }
        });

        if (imageNode && imagePos >= 0) {
          const currentSrc = imageNode.attrs.src || '';
          const currentAlt = imageNode.attrs.alt || '';
          
          // Open image modal with current values
          setShowImageModal(true);
          // We'll need to handle pre-filling the modal, but for now just open it
          // The user can update the image manually
        }
      }
    };

    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor]);

  if (!isMounted || !editor) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200 bg-white p-2 flex items-center gap-1 flex-wrap flex-shrink-0">
          <div className="text-sm text-gray-500 p-2">Loading editor...</div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[800px] mx-auto bg-white min-h-full py-16 px-8">
            <div className="text-gray-400">Editor loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleInsertImage = (src: string, alt: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src, alt, width: '100%', textAlign: 'left' }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const handleInsertWidget = (block: PageBuilderBlock) => {
    if (editor) {
      editor.chain().focus().insertWidget(block).run();
      setShowWidgetSidebar(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widget-type');
    if (widgetType && editor) {
      const block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: widgetType as PageBuilderBlock['type'],
        content: {},
        styles: {},
        settings: {},
      } as PageBuilderBlock;
      
      // Set default content based on type
      switch (block.type) {
        case 'heading':
          block.content = { text: 'Heading', level: 2 };
          break;
        case 'text':
          block.content = { text: '' };
          break;
        case 'image':
          block.content = { url: '', alt: '' };
          break;
        case 'button':
          block.content = { text: 'Click Here', url: '', target: '_self' };
          break;
        case 'video':
          block.content = { url: '', autoplay: false, loop: false, controls: true };
          break;
        case 'gallery':
          block.content = { images: [] };
          break;
        case 'spacer':
          block.content = { height: 50 };
          break;
        case 'divider':
          block.content = { style: 'solid', width: 100, color: '#E5E7EB' };
          break;
      }
      
      editor.chain().focus().insertWidget(block).run();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Focus the editor at the start
      if (editor) {
        editor.chain().focus().setTextSelection(0).run();
      }
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-white">
      {showSlashMenu && editor && (
        <SlashMenu editor={editor} onClose={() => setShowSlashMenu(false)} />
      )}
      
      {/* Bubble Menu - appears when text is selected */}
      {editor && <BubbleMenuComponent editor={editor} />}
      
      {/* Block Menu - appears when paragraph is empty */}
      {editor && <BlockMenu editor={editor} />}
      
      {/* Editor Block Menu - FloatingMenu component from @tiptap/react */}
      {editor && <EditorBlockMenu editor={editor} />}
      
      <WidgetSidebar
        isOpen={showWidgetSidebar}
        onClose={() => setShowWidgetSidebar(false)}
        onInsertWidget={handleInsertWidget}
      />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all ${
          showWidgetSidebar ? 'ml-80' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >

      {/* Editor Content - Canvas Style with Integrated Title */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-[800px] mx-auto bg-white min-h-full py-16 px-8">
          {/* Title Input - Seamlessly integrated */}
          {title !== undefined && onTitleChange && (
            <textarea
              ref={titleTextareaRef}
              value={title}
              onChange={(e) => {
                onTitleChange(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleTitleKeyDown}
              placeholder="Add title"
              className="w-full text-5xl font-bold border-none outline-none resize-none overflow-hidden placeholder-gray-400 bg-transparent mb-8"
              style={{
                minHeight: '80px',
                lineHeight: '1.2',
              }}
            />
          )}
          
          {/* Editor Content */}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleInsertImage}
      />

      {/* Inline Widget Editor Modal */}
      {editingWidget && editor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Edit {editingWidget.block.type.charAt(0).toUpperCase() + editingWidget.block.type.slice(1)} Widget
              </h2>
              <button
                onClick={() => setEditingWidget(null)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <InlineWidgetEditor
                block={editingWidget.block}
                onUpdate={(updatedBlock) => {
                  // Update the widget in the editor
                  if (editor) {
                    const { state } = editor;
                    const { tr } = state;
                    const node = state.doc.nodeAt(editingWidget.nodePos);
                    
                    if (node && node.type.name === 'widget') {
                      tr.setNodeMarkup(editingWidget.nodePos, undefined, {
                        blockData: updatedBlock,
                      });
                      editor.view.dispatch(tr);
                      
                      // Update content
                      const html = editor.getHTML();
                      onChange(html);
                      
                      // Update editing widget
                      setEditingWidget({ block: updatedBlock, nodePos: editingWidget.nodePos });
                    }
                  }
                }}
                onDelete={() => {
                  // Delete the widget from editor
                  if (editor) {
                    const { state } = editor;
                    const { tr } = state;
                    const node = state.doc.nodeAt(editingWidget.nodePos);
                    
                    if (node && node.type.name === 'widget') {
                      tr.delete(editingWidget.nodePos, editingWidget.nodePos + node.nodeSize);
                      editor.view.dispatch(tr);
                      
                      // Update content
                      const html = editor.getHTML();
                      onChange(html);
                      
                      setEditingWidget(null);
                    }
                  }
                }}
                onClose={() => setEditingWidget(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
