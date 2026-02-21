import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageNode from '@/components/admin/ImageNode';

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: { src: string; alt?: string; title?: string; width?: string; textAlign?: 'left' | 'center' | 'right' }) => ReturnType;
    };
  }
}

export const CustomImageExtension = Node.create<ImageOptions>({
  name: 'customImage',

  addOptions() {
    return {
      inline: true,
      allowBase64: true,
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.alt) {
            return {};
          }
          return {
            alt: attributes.alt,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
      width: {
        default: '100%',
        parseHTML: (element) => {
          const width = element.getAttribute('width') || element.style.width || '100%';
          return width;
        },
        renderHTML: (attributes) => {
          if (!attributes.width || attributes.width === '100%') {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      textAlign: {
        default: 'left',
        parseHTML: (element) => {
          const align = element.getAttribute('data-align') || 
                       element.style.textAlign || 
                       element.style.float || 
                       'left';
          if (align === 'center' || element.style.margin === '0 auto') return 'center';
          if (align === 'right' || element.style.float === 'right') return 'right';
          return 'left';
        },
        renderHTML: (attributes) => {
          if (!attributes.textAlign || attributes.textAlign === 'left') {
            return {};
          }
          return {
            'data-align': attributes.textAlign,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNode as any, {
      as: 'div',
    });
  },

  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; title?: string; width?: string; textAlign?: 'left' | 'center' | 'right' }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || '',
              title: options.title || options.alt || '',
              width: options.width || '100%',
              textAlign: options.textAlign || 'left',
            },
          });
        },
    };
  },
});
