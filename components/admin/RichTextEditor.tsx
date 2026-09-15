'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomImageExtension } from '@/lib/customImageExtension';
import { SlashCommand } from '@/lib/slashCommandExtension';
import { DraggableBlocks } from '@/lib/draggableBlocksExtension';
import { X } from 'lucide-react';
import type { EditorView } from '@tiptap/pm/view';
import ImageUploadModal from './ImageUploadModal';
import SlashMenu from './SlashMenu';
import BubbleMenuComponent from './BubbleMenu';
import BlockMenu from './BlockMenu';
import EditorBlockMenu from './EditorBlockMenu';
import { uploadAdminImage } from '@/lib/content/uploadImage';
import { Editor } from '@tiptap/react';

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Dropped and pasted images go to Blob storage. They used to be read with
   * FileReader and inlined as base64, which put multi-megabyte data URLs inside
   * the post body itself.
   */
  const insertUploadedImage = async (view: EditorView, file: File) => {
    setUploadError(null);

    const result = await uploadAdminImage(file, 'blog');
    if (!result.ok) {
      setUploadError(result.error);
      return;
    }

    const { state, dispatch } = view;
    const image = state.schema.nodes.customImage.create({
      src: result.url,
      alt: '',
      width: '100%',
      textAlign: 'left',
    });
    dispatch(state.tr.replaceSelectionWith(image));
    onChange(view.dom.innerHTML);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImageExtension.configure({
        inline: true,
        // Uploads produce URLs now; a data URL here would only come from
        // pasted HTML, and it would bloat the row it is saved into.
        allowBase64: false,
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
      handleDrop: (view, event, _slice, moved) => {
        const file = moved ? null : event.dataTransfer?.files?.[0];
        if (file?.type.startsWith('image/')) {
          event.preventDefault();
          insertUploadedImage(view, file);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        for (const item of Array.from(event.clipboardData?.items ?? [])) {
          if (!item.type.startsWith('image/')) continue;

          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            insertUploadedImage(view, file);
            return true;
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

  // Double-clicking an image opens the insert modal to replace it.
  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && e.detail === 2) {
        e.preventDefault();
        setShowImageModal(true);
      }
    };

    editorElement.addEventListener('click', handleClick);
    return () => editorElement.removeEventListener('click', handleClick);
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

      {uploadError && (
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
          role="alert"
        >
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">

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
    </div>
    </div>
  );
}
