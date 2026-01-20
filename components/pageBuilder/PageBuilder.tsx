'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Eye, Save, X, GripVertical, Settings as SettingsIcon } from 'lucide-react';
import { 
  PageBuilderSection, 
  PageBuilderColumn, 
  PageBuilderBlock,
  createSection,
  createColumn,
  createBlock,
} from '@/lib/pageBuilderStorage';
import SortableSection from './SortableSection';
import SortableBlock from './SortableBlock';
import {
  TextWidget,
  HeadingWidget,
  ImageWidget,
  ButtonWidget,
  VideoWidget,
  GalleryWidget,
  SpacerWidget,
  DividerWidget,
} from './widgets';
import BlockSettings from './BlockSettings';

interface PageBuilderProps {
  initialData?: PageBuilderSection[];
  onSave: (sections: PageBuilderSection[]) => void;
}

const WIDGET_TYPES = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'video', label: 'Video', icon: '▶️' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️🖼️' },
  { type: 'spacer', label: 'Spacer', icon: '⬜' },
  { type: 'divider', label: 'Divider', icon: '➖' },
];

export default function PageBuilder({ initialData = [], onSave }: PageBuilderProps) {
  const [sections, setSections] = useState<PageBuilderSection[]>(initialData);
  const [selectedBlock, setSelectedBlock] = useState<{ sectionId: string; columnId: string; blockId: string } | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setSections(initialData);
  }, [initialData]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    // Handle section reordering
    if (active.data.current?.type === 'section' && over.data.current?.type === 'section') {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      if (oldIndex !== newIndex) {
        setSections(arrayMove(sections, oldIndex, newIndex));
      }
      return;
    }

    // Handle block reordering within column
    if (active.data.current?.type === 'block' && over.data.current?.type === 'block') {
      const sectionId = active.data.current.sectionId;
      const columnId = active.data.current.columnId;
      const overColumnId = over.data.current.columnId;
      
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      // Same column - reorder
      if (columnId === overColumnId) {
        const column = section.columns.find(c => c.id === columnId);
        if (!column) return;

        const oldIndex = column.blocks.findIndex(b => b.id === active.id);
        const newIndex = column.blocks.findIndex(b => b.id === over.id);
        
        if (oldIndex !== newIndex) {
          const newBlocks = arrayMove(column.blocks, oldIndex, newIndex);
          const newColumn = { ...column, blocks: newBlocks };
          const newColumns = section.columns.map(c => c.id === columnId ? newColumn : c);
          const newSection = { ...section, columns: newColumns };
          setSections(sections.map(s => s.id === sectionId ? newSection : s));
        }
      } else {
        // Different column - move block
        const sourceColumn = section.columns.find(c => c.id === columnId);
        const targetColumn = section.columns.find(c => c.id === overColumnId);
        if (!sourceColumn || !targetColumn) return;

        const block = sourceColumn.blocks.find(b => b.id === active.id);
        if (!block) return;

        const newSourceBlocks = sourceColumn.blocks.filter(b => b.id !== active.id);
        const insertIndex = targetColumn.blocks.findIndex(b => b.id === over.id);
        const newTargetBlocks = [...targetColumn.blocks];
        newTargetBlocks.splice(insertIndex >= 0 ? insertIndex : newTargetBlocks.length, 0, block);

        const newColumns = section.columns.map(col => {
          if (col.id === columnId) return { ...col, blocks: newSourceBlocks };
          if (col.id === overColumnId) return { ...col, blocks: newTargetBlocks };
          return col;
        });

        setSections(sections.map(s => 
          s.id === sectionId ? { ...s, columns: newColumns } : s
        ));
      }
    }
  };

  const addSection = () => {
    const newSection = createSection();
    setSections([...sections, newSection]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    if (selectedBlock?.sectionId === sectionId) {
      setSelectedBlock(null);
    }
  };

  const addColumn = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newColumn = createColumn(100 / (section.columns.length + 1));
    const updatedColumns = section.columns.map(col => ({
      ...col,
      width: 100 / (section.columns.length + 1),
    }));

    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, columns: [...updatedColumns, newColumn] }
        : s
    ));
  };

  const deleteColumn = (sectionId: string, columnId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || section.columns.length <= 1) return;

    const remainingColumns = section.columns.filter(c => c.id !== columnId);
    const newWidth = 100 / remainingColumns.length;
    const updatedColumns = remainingColumns.map(col => ({ ...col, width: newWidth }));

    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, columns: updatedColumns }
        : s
    ));

    if (selectedBlock?.columnId === columnId) {
      setSelectedBlock(null);
    }
  };

  const addBlock = (sectionId: string, columnId: string, blockType: string) => {
    const newBlock = createBlock(blockType as PageBuilderBlock['type']);
    
    setSections(sections.map(section => 
      section.id === sectionId
        ? {
            ...section,
            columns: section.columns.map(col =>
              col.id === columnId
                ? { ...col, blocks: [...col.blocks, newBlock] }
                : col
            ),
          }
        : section
    ));
  };

  const updateBlock = (sectionId: string, columnId: string, blockId: string, updates: Partial<PageBuilderBlock>) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            columns: section.columns.map(col =>
              col.id === columnId
                ? {
                    ...col,
                    blocks: col.blocks.map(block =>
                      block.id === blockId ? { ...block, ...updates } : block
                    ),
                  }
                : col
            ),
          }
        : section
    ));
  };

  const deleteBlock = (sectionId: string, columnId: string, blockId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            columns: section.columns.map(col =>
              col.id === columnId
                ? {
                    ...col,
                    blocks: col.blocks.filter(block => block.id !== blockId),
                  }
                : col
            ),
          }
        : section
    ));
    
    if (selectedBlock?.blockId === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleBlockClick = (sectionId: string, columnId: string, blockId: string) => {
    if (selectedBlock?.blockId === blockId) {
      setSelectedBlock(null);
    } else {
      setSelectedBlock({ sectionId, columnId, blockId });
    }
  };

  const renderBlock = (block: PageBuilderBlock, sectionId: string, columnId: string) => {
    const commonProps = {
      block,
      isEditing: !isPreview,
      onUpdate: (updates: Partial<PageBuilderBlock>) =>
        updateBlock(sectionId, columnId, block.id, updates),
      onDelete: () => deleteBlock(sectionId, columnId, block.id),
    };

    switch (block.type) {
      case 'text':
        return <TextWidget key={block.id} {...commonProps} />;
      case 'heading':
        return <HeadingWidget key={block.id} {...commonProps} />;
      case 'image':
        return <ImageWidget key={block.id} {...commonProps} />;
      case 'button':
        return <ButtonWidget key={block.id} {...commonProps} />;
      case 'video':
        return <VideoWidget key={block.id} {...commonProps} />;
      case 'gallery':
        return <GalleryWidget key={block.id} {...commonProps} />;
      case 'spacer':
        return <SpacerWidget key={block.id} {...commonProps} />;
      case 'divider':
        return <DividerWidget key={block.id} {...commonProps} />;
      default:
        return null;
    }
  };

  const selectedBlockData = selectedBlock
    ? sections
        .find(s => s.id === selectedBlock.sectionId)
        ?.columns.find(c => c.id === selectedBlock.columnId)
        ?.blocks.find(b => b.id === selectedBlock.blockId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-200px)] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Left Sidebar - Widget Library */}
        {!isPreview && (
          <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Widgets</h3>
            <div className="space-y-2">
              {WIDGET_TYPES.map(widget => (
                <button
                  key={widget.type}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left flex items-center gap-2 transition-colors"
                  onClick={() => {
                    if (sections.length === 0) {
                      addSection();
                    }
                    const firstSection = sections[0] || createSection();
                    const firstColumn = firstSection.columns[0] || createColumn(100);
                    if (!sections.find(s => s.id === firstSection.id)) {
                      setSections([firstSection]);
                    }
                    addBlock(firstSection.id, firstColumn.id, widget.type);
                  }}
                >
                  <span className="text-lg">{widget.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{widget.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                {!isPreview && (
                  <button
                    onClick={addSection}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    Add Section
                  </button>
                )}
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                    isPreview ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isPreview ? <Eye size={18} /> : <Eye size={18} />}
                  {isPreview ? 'Edit Mode' : 'Preview'}
                </button>
              </div>
              <button
                onClick={() => onSave(sections)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save size={18} />
                Save Layout
              </button>
            </div>

            {/* Sections */}
            {sections.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No sections yet. Add your first section!</p>
                <button
                  onClick={addSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Section
                </button>
              </div>
            ) : (
              <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.map((section, sectionIndex) => (
                    <SortableSection key={section.id} section={section} index={sectionIndex}>
                      <div
                        className="bg-white rounded-lg border-2 border-gray-200 p-4"
                        style={{
                          backgroundColor: section.styles?.backgroundColor,
                          paddingTop: section.styles?.padding?.top ? `${section.styles.padding.top}px` : undefined,
                          paddingBottom: section.styles?.padding?.bottom ? `${section.styles.padding.bottom}px` : undefined,
                          backgroundImage: section.styles?.backgroundImage ? `url(${section.styles.backgroundImage})` : undefined,
                          backgroundSize: section.styles?.backgroundSize || 'cover',
                          backgroundPosition: section.styles?.backgroundPosition || 'center',
                          backgroundRepeat: section.styles?.backgroundRepeat || 'no-repeat',
                        }}
                      >
                        {/* Section Controls */}
                        {!isPreview && (
                          <div className="mb-4 flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <GripVertical className="text-gray-400 cursor-move" size={16} />
                              <span className="text-sm font-medium text-gray-700">Section {sectionIndex + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addColumn(section.id)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                Add Column
                              </button>
                              <button
                                onClick={() => deleteSection(section.id)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Columns */}
                        <div className="flex gap-4">
                          {section.columns.map((column, colIndex) => (
                            <div
                              key={column.id}
                              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]"
                              style={{ width: `${column.width}%` }}
                            >
                              {!isPreview && (
                                <div className="mb-2 flex items-center justify-between">
                                  <div className="text-xs text-gray-500">
                                    Column {colIndex + 1} ({column.width.toFixed(0)}%)
                                  </div>
                                  {section.columns.length > 1 && (
                                    <button
                                      onClick={() => deleteColumn(section.id, column.id)}
                                      className="text-xs text-red-600 hover:text-red-700"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Blocks */}
                              <SortableContext
                                items={column.blocks.map(b => b.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-4">
                                  {column.blocks.map((block) => (
                                    <SortableBlock
                                      key={block.id}
                                      block={block}
                                      sectionId={section.id}
                                      columnId={column.id}
                                    >
                                      <div
                                        onClick={() => handleBlockClick(section.id, column.id, block.id)}
                                        className={selectedBlock?.blockId === block.id ? 'ring-2 ring-blue-500 rounded' : ''}
                                      >
                                        {renderBlock(block, section.id, column.id)}
                                      </div>
                                    </SortableBlock>
                                  ))}
                                </div>
                              </SortableContext>

                              {/* Add Block Button */}
                              {!isPreview && (
                                <div className="mt-4">
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        addBlock(section.id, column.id, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  >
                                    <option value="">Add Widget...</option>
                                    {WIDGET_TYPES.map(widget => (
                                      <option key={widget.type} value={widget.type}>
                                        {widget.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </SortableSection>
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </div>

        {/* Right Sidebar - Block Settings */}
        {selectedBlockData && !isPreview && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Block Settings</h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>
            <BlockSettings
              block={selectedBlockData}
              onUpdate={(updates) => {
                if (selectedBlock) {
                  updateBlock(selectedBlock.sectionId, selectedBlock.columnId, selectedBlock.blockId, updates);
                }
              }}
            />
          </div>
        )}
      </div>
    </DndContext>
  );
}
