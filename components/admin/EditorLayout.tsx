'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, Save, Image as ImageIcon, LayoutGrid, Undo, Redo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tiptap/react';

interface EditorLayoutProps {
  children: React.ReactNode;
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
  seoScore?: number;
  savedStatus?: 'saved' | 'saving' | 'unsaved';
  editor?: Editor | null;
  onImageInsert?: () => void;
  onWidgetToggle?: () => void;
  rightSidebarContent?: {
    postTab?: React.ReactNode;
    blockTab?: React.ReactNode;
  };
}

export default function EditorLayout({
  children,
  title,
  onTitleChange,
  onSave,
  onPublish,
  isSaving = false,
  seoScore = 0,
  savedStatus = 'saved',
  rightSidebarContent,
  editor,
  onImageInsert,
  onWidgetToggle,
}: EditorLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'post' | 'block'>('post');
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = titleTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [title]);

  const getSavedStatusText = () => {
    switch (savedStatus) {
      case 'saving':
        return 'Saving...';
      case 'unsaved':
        return 'Unsaved changes';
      case 'saved':
      default:
        return 'Saved';
    }
  };

  const getSavedStatusColor = () => {
    switch (savedStatus) {
      case 'saving':
        return 'text-yellow-600';
      case 'unsaved':
        return 'text-red-600';
      case 'saved':
      default:
        return 'text-green-600';
    }
  };

  const getSeoScoreColor = () => {
    if (seoScore >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (seoScore >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-50">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            title="Add Block"
          >
            <Plus size={18} />
            <span>Add Block</span>
          </button>
          
          {/* Fixed Toolbar for Block-Level Actions */}
          {editor && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={onImageInsert}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Add Image"
              >
                <ImageIcon size={18} className="text-gray-700" />
              </button>
              <button
                onClick={onWidgetToggle}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Widgets"
              >
                <LayoutGrid size={18} className="text-gray-700" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo size={18} className="text-gray-700" />
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo size={18} className="text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Center - Saved Status */}
        <div className="flex-1 flex justify-center">
          <span className={`text-sm font-medium ${getSavedStatusColor()}`}>
            {getSavedStatusText()}
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Rank Math Score Pill */}
          <div
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getSeoScoreColor()}`}
          >
            SEO: {seoScore}
          </div>
          
          {/* Settings Icon */}
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Settings"
          >
            <Settings size={20} className="text-gray-700" />
          </button>

          {/* Publish Button */}
          <button
            onClick={onPublish}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center Content */}
        <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
          {/* Editor Content - includes title */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>

        {/* Right Sidebar */}
        {rightSidebarContent && (
          <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
            {/* Tabs */}
            <div className="border-b border-gray-200 flex">
              <button
                onClick={() => setActiveTab('post')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'post'
                    ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Post
              </button>
              <button
                onClick={() => setActiveTab('block')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'block'
                    ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Block
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'post' && rightSidebarContent.postTab && (
                <div>{rightSidebarContent.postTab}</div>
              )}
              {activeTab === 'block' && rightSidebarContent.blockTab && (
                <div>{rightSidebarContent.blockTab}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
