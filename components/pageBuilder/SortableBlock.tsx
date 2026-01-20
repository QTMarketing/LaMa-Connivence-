'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { PageBuilderBlock } from '@/lib/pageBuilderStorage';

interface SortableBlockProps {
  block: PageBuilderBlock;
  children: React.ReactNode;
  sectionId: string;
  columnId: string;
}

export default function SortableBlock({ block, children, sectionId, columnId }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
      sectionId,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isDragging && (
        <div className="absolute inset-0 border-2 border-blue-500 bg-blue-50/50 rounded-lg z-50" />
      )}
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-move hover:bg-gray-100 p-1 rounded"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
