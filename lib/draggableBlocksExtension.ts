import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';

export interface DraggableBlocksOptions {
  // Configuration options can be added here
}

export const DraggableBlocks = Extension.create<DraggableBlocksOptions>({
  name: 'draggableBlocks',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('draggableBlocks'),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const { doc } = state;

            // Add data attributes to top-level nodes for identification
            doc.descendants((node: ProseMirrorNode, pos: number) => {
              const resolvedPos = doc.resolve(pos);
              // Only mark top-level nodes (depth 1)
              if (resolvedPos.depth === 1) {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    'data-block-id': `block-${pos}`,
                    'data-block-type': node.type.name,
                    class: 'draggable-block',
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
