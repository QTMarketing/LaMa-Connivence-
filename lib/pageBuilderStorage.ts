// Page Builder Data Structures and Storage

export interface BlockStyles {
  padding?: { top: number; right: number; bottom: number; left: number };
  margin?: { top: number; right: number; bottom: number; left: number };
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderRadius?: number;
  border?: { width: number; color: string; style: string };
  width?: string;
  height?: string;
  maxWidth?: string;
  minHeight?: string;
}

export interface BlockSettings {
  responsive?: {
    mobile?: Partial<BlockStyles>;
    tablet?: Partial<BlockStyles>;
    desktop?: Partial<BlockStyles>;
  };
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
  visibility?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
  };
}

export interface PageBuilderBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'video' | 'gallery' | 'spacer' | 'divider' | 'columns';
  content: any; // Block-specific content
  styles: BlockStyles;
  settings: BlockSettings;
}

export interface PageBuilderColumn {
  id: string;
  width: number; // Percentage (e.g., 50 for 50%)
  blocks: PageBuilderBlock[];
}

export interface PageBuilderSection {
  id: string;
  type: 'default' | 'full-width' | 'boxed';
  columns: PageBuilderColumn[];
  styles: {
    backgroundColor?: string;
    padding?: { top: number; bottom: number };
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
  };
}

export interface PageBuilderData {
  id: string;
  pageId: string; // Links to blog post or page
  sections: PageBuilderSection[];
  version: number;
  updatedAt: string;
  createdAt: string;
}

// Storage functions using localStorage
const STORAGE_KEY = 'lama_page_builder_data';

export const pageBuilderStorage = {
  // Get all page builder data
  getAll(): PageBuilderData[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get page builder data by page ID
  getByPageId(pageId: string): PageBuilderData | null {
    const all = this.getAll();
    return all.find(pb => pb.pageId === pageId) || null;
  },

  // Get page builder data by ID
  getById(id: string): PageBuilderData | null {
    const all = this.getAll();
    return all.find(pb => pb.id === id) || null;
  },

  // Save page builder data
  save(data: PageBuilderData): void {
    if (typeof window === 'undefined') return;
    const all = this.getAll();
    const existingIndex = all.findIndex(pb => pb.id === data.id);
    
    if (existingIndex >= 0) {
      all[existingIndex] = { ...data, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('pageBuilderUpdated'));
  },

  // Delete page builder data
  delete(id: string): void {
    if (typeof window === 'undefined') return;
    const all = this.getAll();
    const filtered = all.filter(pb => pb.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('pageBuilderUpdated'));
  },

  // Delete by page ID
  deleteByPageId(pageId: string): void {
    if (typeof window === 'undefined') return;
    const all = this.getAll();
    const filtered = all.filter(pb => pb.pageId !== pageId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('pageBuilderUpdated'));
  },
};

// Helper function to create a new page builder data
export function createPageBuilderData(pageId: string): PageBuilderData {
  return {
    id: `pb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    pageId,
    sections: [],
    version: 1,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

// Helper function to create a new section
export function createSection(): PageBuilderSection {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'default',
    columns: [{
      id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      width: 100,
      blocks: [],
    }],
    styles: {},
  };
}

// Helper function to create a new column
export function createColumn(width: number = 100): PageBuilderColumn {
  return {
    id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    width,
    blocks: [],
  };
}

// Helper function to create a new block
export function createBlock(type: PageBuilderBlock['type']): PageBuilderBlock {
  const baseBlock: PageBuilderBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: {},
    styles: {},
    settings: {},
  };

  // Set default content based on block type
  switch (type) {
    case 'text':
      baseBlock.content = { text: '' };
      break;
    case 'heading':
      baseBlock.content = { text: '', level: 2 };
      baseBlock.styles = { fontSize: 32, fontWeight: 'bold' };
      break;
    case 'image':
      baseBlock.content = { url: '', alt: '' };
      break;
    case 'button':
      baseBlock.content = { text: 'Click Here', url: '', target: '_self' };
      baseBlock.styles = { 
        backgroundColor: '#3B82F6', 
        textColor: '#FFFFFF',
        padding: { top: 12, right: 24, bottom: 12, left: 24 },
        borderRadius: 6,
      };
      break;
    case 'video':
      baseBlock.content = { url: '', autoplay: false, loop: false, controls: true };
      break;
    case 'gallery':
      baseBlock.content = { images: [] };
      break;
    case 'spacer':
      baseBlock.content = { height: 50 };
      baseBlock.styles = { height: '50px' };
      break;
    case 'divider':
      baseBlock.content = { style: 'solid', width: 100, color: '#E5E7EB' };
      baseBlock.styles = { margin: { top: 20, right: 0, bottom: 20, left: 0 } };
      break;
  }

  return baseBlock;
}
