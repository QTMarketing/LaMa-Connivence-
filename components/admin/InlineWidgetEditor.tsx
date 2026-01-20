'use client';

import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';
import {
  TextWidget,
  HeadingWidget,
  ImageWidget,
  ButtonWidget,
  VideoWidget,
  GalleryWidget,
  SpacerWidget,
  DividerWidget,
} from '@/components/pageBuilder/widgets';

interface InlineWidgetEditorProps {
  block: PageBuilderBlock;
  onUpdate: (block: PageBuilderBlock) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function InlineWidgetEditor({ block, onUpdate, onDelete, onClose }: InlineWidgetEditorProps) {
  const [localBlock, setLocalBlock] = useState(block);

  useEffect(() => {
    setLocalBlock(block);
  }, [block]);

  const handleUpdate = (updates: Partial<PageBuilderBlock>) => {
    const updated = { ...localBlock, ...updates };
    setLocalBlock(updated);
    onUpdate(updated);
  };

  const renderWidget = () => {
    const commonProps = {
      block: localBlock,
      isEditing: true,
      onUpdate: handleUpdate,
      onDelete: () => {
        onDelete();
        onClose();
      },
    };

    switch (localBlock.type) {
      case 'text':
        return <TextWidget {...commonProps} />;
      case 'heading':
        return <HeadingWidget {...commonProps} />;
      case 'image':
        return <ImageWidget {...commonProps} />;
      case 'button':
        return <ButtonWidget {...commonProps} />;
      case 'video':
        return <VideoWidget {...commonProps} />;
      case 'gallery':
        return <GalleryWidget {...commonProps} />;
      case 'spacer':
        return <SpacerWidget {...commonProps} />;
      case 'divider':
        return <DividerWidget {...commonProps} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50/50 my-4 relative">
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-blue-200 rounded bg-white shadow-sm"
          title="Close Editor"
        >
          <X size={14} />
        </button>
      </div>
      <div className="mt-4">
        {renderWidget()}
      </div>
    </div>
  );
}
