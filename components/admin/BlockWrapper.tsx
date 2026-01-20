'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface BlockWrapperProps {
  id: string;
  children: React.ReactNode;
  nodeType: string;
}

export default function BlockWrapper({ 
  id, 
  children, 
  nodeType,
}: BlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'editor-block',
      nodeType,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/block flex items-start gap-2 min-h-[24px] my-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-block-id={id}
      data-block-type={nodeType}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity mt-1 ${
          isHovered || isDragging ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ marginLeft: '-32px' }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <GripVertical 
          size={16} 
          className="text-gray-400 hover:text-gray-600"
        />
      </div>

      {/* Block Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
