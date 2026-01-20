// Blog storage utilities using localStorage
// This will be replaced with database later

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'scheduled' | 'trash';
  publishedAt?: string;
  author: string;
  authorId: string;
  featuredImage?: string;
  
  // SEO - RankMath Style
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  seoScore: number;
  
  // Schema
  schemaType?: string;
  schemaData?: any;
  
  // Social
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // Advanced SEO
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  
  // Readability
  readabilityScore: number;
  wordCount: number;
  
  // Relations
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Page Builder
  pageBuilderData?: any; // PageBuilderSection[] from pageBuilderStorage
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  BLOGS: 'lama_cms_blogs',
  CATEGORIES: 'lama_cms_categories',
  TAGS: 'lama_cms_tags',
};

// Blog CRUD operations
export const blogStorage = {
  getAll: (): BlogPost[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): BlogPost | null => {
    const blogs = blogStorage.getAll();
    return blogs.find(b => b.id === id) || null;
  },

  getBySlug: (slug: string): BlogPost | null => {
    const blogs = blogStorage.getAll();
    return blogs.find(b => b.slug === slug) || null;
  },

  getPublished: (): BlogPost[] => {
    return blogStorage.getAll().filter(b => b.status === 'published');
  },

  save: (blog: BlogPost): void => {
    const blogs = blogStorage.getAll();
    const index = blogs.findIndex(b => b.id === blog.id);
    
    if (index >= 0) {
      blogs[index] = { ...blog, updatedAt: new Date().toISOString() };
    } else {
      blogs.push({ ...blog, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
    
    // Dispatch event for other components to listen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blogsUpdated'));
    }
  },

  delete: (id: string): void => {
    const blogs = blogStorage.getAll();
    const filtered = blogs.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(filtered));
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blogsUpdated'));
    }
  },

  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  getByCategory: (categoryId: string): BlogPost[] => {
    return blogStorage.getAll().filter(b => b.categoryId === categoryId);
  },

  getByTag: (tagId: string): BlogPost[] => {
    return blogStorage.getAll().filter(b => 
      b.tags.some(t => t.id === tagId)
    );
  },

  countByCategory: (categoryId: string): number => {
    return blogStorage.getByCategory(categoryId).length;
  },

  countByTag: (tagId: string): number => {
    return blogStorage.getByTag(tagId).length;
  },
};

// Category operations
export const categoryStorage = {
  getAll: (): Category[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Category | null => {
    const categories = categoryStorage.getAll();
    return categories.find(c => c.id === id) || null;
  },

  save: (category: Category): void => {
    const categories = categoryStorage.getAll();
    const index = categories.findIndex(c => c.id === category.id);
    
    if (index >= 0) {
      categories[index] = { ...category, updatedAt: new Date().toISOString() };
    } else {
      categories.push({ ...category, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  delete: (id: string): void => {
    const categories = categoryStorage.getAll();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  },
};

// Tag operations
export const tagStorage = {
  getAll: (): Tag[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Tag | null => {
    const tags = tagStorage.getAll();
    return tags.find(t => t.id === t.id) || null;
  },

  save: (tag: Tag): void => {
    const tags = tagStorage.getAll();
    const index = tags.findIndex(t => t.id === tag.id);
    
    if (index >= 0) {
      tags[index] = { ...tag, updatedAt: new Date().toISOString() };
    } else {
      tags.push({ ...tag, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  delete: (id: string): void => {
    const tags = tagStorage.getAll();
    const filtered = tags.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(filtered));
  },
};
