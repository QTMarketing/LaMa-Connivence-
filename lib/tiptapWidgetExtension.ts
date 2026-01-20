// Tiptap extension for Page Builder widgets
import { Node, mergeAttributes } from '@tiptap/core';
import { PageBuilderBlock } from './pageBuilderStorage';

export interface WidgetOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    widget: {
      insertWidget: (block: PageBuilderBlock) => ReturnType;
    };
  }
}

export const WidgetExtension = Node.create<WidgetOptions>({
  name: 'widget',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      blockData: {
        default: null,
        parseHTML: (element) => {
          const data = element.getAttribute('data-block');
          try {
            return data ? JSON.parse(data) : null;
          } catch {
            return null;
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.blockData) {
            return {};
          }
          return {
            'data-block': JSON.stringify(attributes.blockData),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="widget"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const blockData = node.attrs.blockData as PageBuilderBlock;
    if (!blockData) return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];

    // Render widget based on type
    const widgetHTML = renderWidgetHTML(blockData);
    
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-type': 'widget',
          'data-block': JSON.stringify(blockData),
          class: 'widget-block my-4 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50',
          style: 'border: 2px dashed #D1D5DB; border-radius: 8px; background: #F9FAFB; padding: 16px;',
          contenteditable: 'false',
        }
      ),
      widgetHTML,
    ];
  },

  addCommands() {
    return {
      insertWidget:
        (block: PageBuilderBlock) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              blockData: block,
            },
          });
        },
    };
  },
});

function renderWidgetHTML(block: PageBuilderBlock): string {
  const widgetIcons: Record<string, string> = {
    heading: 'H',
    text: 'T',
    image: '🖼️',
    button: '🔘',
    video: '▶️',
    gallery: '🖼️🖼️',
    spacer: '⬜',
    divider: '➖',
  };

  const widgetLabels: Record<string, string> = {
    heading: 'Heading',
    text: 'Text',
    image: 'Image',
    button: 'Button',
    video: 'Video',
    gallery: 'Gallery',
    spacer: 'Spacer',
    divider: 'Divider',
  };

  const icon = widgetIcons[block.type] || '📦';
  const label = widgetLabels[block.type] || 'Widget';

  // Create a visual placeholder with preview
  let previewContent = '';
  let hasContent = false;

  switch (block.type) {
    case 'heading':
      const headingText = block.content?.text || '';
      const level = block.content?.level || 2;
      if (headingText) {
        previewContent = `<h${level} style="margin: 0; font-size: ${level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem'}; font-weight: bold;">${headingText}</h${level}>`;
        hasContent = true;
      }
      break;
    
    case 'text':
      const textContent = block.content?.text || '';
      if (textContent) {
        previewContent = `<div style="color: #374151; line-height: 1.6;">${textContent.substring(0, 100)}${textContent.length > 100 ? '...' : ''}</div>`;
        hasContent = true;
      }
      break;
    
    case 'image':
      const imgUrl = block.content?.url || '';
      if (imgUrl) {
        previewContent = `<img src="${imgUrl}" alt="${block.content?.alt || ''}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;" />`;
        hasContent = true;
      }
      break;
    
    case 'button':
      const btnText = block.content?.text || '';
      if (btnText) {
        previewContent = `<div style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; border-radius: 6px; font-weight: 500;">${btnText}</div>`;
        hasContent = true;
      }
      break;
    
    case 'video':
      const videoUrl = block.content?.url || '';
      if (videoUrl) {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
          const youtubeId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
          if (youtubeId) {
            previewContent = `<div style="position: relative; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden;"><iframe src="https://www.youtube.com/embed/${youtubeId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div>`;
            hasContent = true;
          }
        } else if (videoUrl) {
          previewContent = `<div style="position: relative; padding-bottom: 56.25%; height: 0; background: #000; border-radius: 8px; overflow: hidden;"><video src="${videoUrl}" controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></video></div>`;
          hasContent = true;
        }
      }
      break;
    
    case 'gallery':
      const images = block.content?.images || [];
      if (images.length > 0) {
        previewContent = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">${images.slice(0, 6).map((img: any) => `<img src="${img.url}" alt="${img.alt || ''}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px;" />`).join('')}</div>`;
        hasContent = true;
      }
      break;
    
    case 'spacer':
      const height = block.content?.height || 50;
      previewContent = `<div style="height: ${height}px; width: 100%; background: linear-gradient(to bottom, #E5E7EB 0%, #E5E7EB 50%, transparent 50%, transparent 100%); background-size: 100% 20px; border-radius: 4px;"></div>`;
      hasContent = true;
      break;
    
    case 'divider':
      const dividerStyle = block.content?.style || 'solid';
      const dividerWidth = block.content?.width || 100;
      const dividerColor = block.content?.color || '#E5E7EB';
      previewContent = `<div style="text-align: center; padding: 20px 0;"><hr style="border-style: ${dividerStyle}; border-width: 1px 0 0 0; border-color: ${dividerColor}; width: ${dividerWidth}%; margin: 0 auto;" /></div>`;
      hasContent = true;
      break;
  }

  // Return placeholder with preview or empty state
  return `
    <div style="position: relative;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px 12px; background: #F3F4F6; border-radius: 6px; font-size: 12px; font-weight: 600; color: #6B7280;">
        <span style="font-size: 16px;">${icon}</span>
        <span>${label} Widget</span>
        ${hasContent ? '<span style="margin-left: auto; padding: 2px 8px; background: #10B981; color: white; border-radius: 4px; font-size: 10px;">Configured</span>' : '<span style="margin-left: auto; padding: 2px 8px; background: #F59E0B; color: white; border-radius: 4px; font-size: 10px;">Empty</span>'}
      </div>
      ${hasContent ? `<div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #E5E7EB;">${previewContent}</div>` : `<div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 6px; border: 1px dashed #D1D5DB; color: #9CA3AF; font-size: 14px;">Click to configure this ${label.toLowerCase()} widget</div>`}
    </div>
  `;
}
