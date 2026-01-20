'use client';

import { GripVertical } from 'lucide-react';

interface DraggableBlockHandleProps {
  blockId: string;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
}

export default function DraggableBlockHandle({ blockId, onDragStart }: DraggableBlockHandleProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, blockId)}
      className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity -ml-8"
      style={{ marginTop: '2px' }}
    >
      <GripVertical size={16} className="text-gray-400 hover:text-gray-600" />
    </div>
  );
}
