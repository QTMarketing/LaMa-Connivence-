'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, EyeOff, Calendar, User, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { blogStorage, categoryStorage, tagStorage, type BlogPost, type Category, type Tag } from '@/lib/blogStorage';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SEOPanel from '@/components/admin/SEOPanel';
import PageBuilder from '@/components/pageBuilder/PageBuilder';
import EditorLayout from '@/components/admin/EditorLayout';
import BlockSettings from '@/components/admin/BlockSettings';
import { PageBuilderSection } from '@/lib/pageBuilderStorage';
import { format } from 'date-fns';

interface BlogEditorProps {
  blogId?: string;
  isNew?: boolean;
}

export default function BlogEditor({ blogId, isNew: isNewProp }: BlogEditorProps) {
  const router = useRouter();
  const isNew = isNewProp || !blogId;

  const [blog, setBlog] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    author: 'Admin',
    authorId: 'admin-1',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    seoScore: 0,
    robotsIndex: true,
    robotsFollow: true,
    robotsNoArchive: false,
    robotsNoSnippet: false,
    readabilityScore: 0,
    wordCount: 0,
    tags: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [selectedBlock, setSelectedBlock] = useState<{
    type: string;
    node: any;
    position: number;
  } | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    if (!isNew && blogId) {
      const existingBlog = blogStorage.getById(blogId);
      if (existingBlog) {
        setBlog(existingBlog);
        setSelectedCategoryId(existingBlog.categoryId || '');
        setSelectedTagIds(existingBlog.tags.map(t => t.id));
        setSavedStatus('saved');
      } else {
        router.push('/admin/blog');
      }
    } else {
      setSavedStatus('unsaved');
    }
    
    setCategories(categoryStorage.getAll());
    setTags(tagStorage.getAll());
  }, [blogId, isNew, router]);

  const handleTitleChange = (title: string) => {
    const slug = blogStorage.generateSlug(title);
    setBlog({
      ...blog,
      title,
      slug,
      seoTitle: blog.seoTitle || title,
    });
    setSavedStatus('unsaved');
  };

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    setIsSaving(true);
    setSavedStatus('saving');
    
    try {
      const blogToSave: BlogPost = {
        id: blog.id || `blog-${Date.now()}`,
        title: blog.title || '',
        slug: blog.slug || blogStorage.generateSlug(blog.title || 'untitled'),
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : blog.publishedAt,
        author: blog.author || 'Admin',
        authorId: blog.authorId || 'admin-1',
        featuredImage: blog.featuredImage || '',
        seoTitle: blog.seoTitle || blog.title || '',
        seoDescription: blog.seoDescription || '',
        focusKeyword: blog.focusKeyword || '',
        seoScore: blog.seoScore || 0,
        schemaType: blog.schemaType,
        schemaData: blog.schemaData,
        ogTitle: blog.ogTitle || blog.seoTitle || blog.title || '',
        ogDescription: blog.ogDescription || blog.seoDescription || '',
        ogImage: blog.ogImage || blog.featuredImage || '',
        twitterTitle: blog.twitterTitle || blog.ogTitle || blog.seoTitle || blog.title || '',
        twitterDescription: blog.twitterDescription || blog.ogDescription || blog.seoDescription || '',
        twitterImage: blog.twitterImage || blog.ogImage || blog.featuredImage || '',
        canonicalUrl: blog.canonicalUrl,
        robotsIndex: blog.robotsIndex ?? true,
        robotsFollow: blog.robotsFollow ?? true,
        robotsNoArchive: blog.robotsNoArchive ?? false,
        robotsNoSnippet: blog.robotsNoSnippet ?? false,
        readabilityScore: blog.readabilityScore || 0,
        wordCount: (blog.content || '').split(/\s+/).filter(w => w.length > 0).length,
        categoryId: selectedCategoryId || undefined,
        category: selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : undefined,
        tags: tags.filter(t => selectedTagIds.includes(t.id)),
        pageBuilderData: blog.pageBuilderData,
        createdAt: blog.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      blogStorage.save(blogToSave);
      
      setSavedStatus('saved');
      
      // Show success message
      alert(status === 'published' ? 'Post published successfully!' : 'Post saved as draft!');
      
      // Redirect to list or stay on page
      if (status === 'published') {
        router.push('/admin/blog');
      }
    } catch (error) {
      setSavedStatus('unsaved');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error saving post: ${errorMessage}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateWordCount = (content: string) => {
    return content.split(/\s+/).filter(w => w.length > 0).length;
  };

  // Track content changes for saved status (only when content actually changes, not on initial load)
  useEffect(() => {
    if (blog.id && (blog.content || blog.title)) {
      // Only mark as unsaved if we have an existing blog (not a new one on first render)
      const timeoutId = setTimeout(() => {
        setSavedStatus('unsaved');
      }, 500); // Debounce to avoid too frequent updates
      
      return () => clearTimeout(timeoutId);
    }
  }, [blog.content, blog.title, blog.id]);

  return (
    <>
      {/* Preview Modal/Overlay */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Preview Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {/* Hero Section */}
              {blog.featuredImage && (
                <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.seoTitle || blog.title || 'Blog preview'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    {blog.category && (
                      <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-4 py-2 mb-4">
                        <span className="text-sm font-bold uppercase tracking-wide">
                          {blog.category.name}
                        </span>
                      </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-black mb-2">
                      {blog.seoTitle || blog.title || 'Untitled Post'}
                    </h1>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {blog.publishedAt 
                            ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                            : 'Not published yet'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{blog.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Title (if no featured image) */}
              {!blog.featuredImage && (
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    {blog.seoTitle || blog.title || 'Untitled Post'}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {blog.publishedAt 
                          ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                          : 'Not published yet'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content || '<p class="text-gray-500 italic">No content yet. Start writing to see preview.</p>'
                }}
              />

              {/* Tags */}
              {tags.filter(t => selectedTagIds.includes(t.id)).length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700">Tags:</span>
                    {tags.filter(t => selectedTagIds.includes(t.id)).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>This is a preview of how your post will appear on the website.</p>
                {blog.slug && (
                  <p className="mt-2">
                    URL: <code className="bg-gray-100 px-2 py-1 rounded">/media/blog/{blog.slug}</code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <EditorLayout
        title={blog.title || ''}
        onTitleChange={handleTitleChange}
        onSave={() => handleSave('draft')}
        onPublish={() => handleSave('published')}
        isSaving={isSaving}
        seoScore={blog.seoScore || 0}
        savedStatus={savedStatus}
        editor={editorInstance}
        onImageInsert={() => {
          // Trigger image modal - we'll need to pass this through
          const event = new CustomEvent('openImageModal');
          window.dispatchEvent(event);
        }}
        onWidgetToggle={() => {
          const event = new CustomEvent('toggleWidgetSidebar');
          window.dispatchEvent(event);
        }}
        rightSidebarContent={{
          postTab: (
            <div className="space-y-6">
              {/* Publish */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Publish</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={blog.status}
                      onChange={(e) => setBlog({ ...blog, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  {blog.publishedAt && (
                    <div className="text-xs text-gray-600">
                      Published: {format(new Date(blog.publishedAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Featured Image</h3>
                <div className="space-y-3">
                  {blog.featuredImage ? (
                    <div className="relative">
                      <img
                        src={blog.featuredImage}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        onClick={() => setBlog({ ...blog, featuredImage: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                      <button className="text-sm text-blue-600 hover:underline">
                        Set featured image
                      </button>
                    </div>
                  )}
                  <input
                    type="url"
                    value={blog.featuredImage || ''}
                    onChange={(e) => setBlog({ ...blog, featuredImage: e.target.value })}
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Categories</h3>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Uncategorized</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Tags</h3>
                <div className="space-y-2">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTagIds([...selectedTagIds, tag.id]);
                          } else {
                            setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO Panel */}
              <SEOPanel
                data={{
                  seoTitle: blog.seoTitle,
                  seoDescription: blog.seoDescription,
                  focusKeyword: blog.focusKeyword,
                  canonicalUrl: blog.canonicalUrl,
                  robotsIndex: blog.robotsIndex ?? true,
                  robotsFollow: blog.robotsFollow ?? true,
                  robotsNoArchive: blog.robotsNoArchive ?? false,
                  robotsNoSnippet: blog.robotsNoSnippet ?? false,
                  ogTitle: blog.ogTitle,
                  ogDescription: blog.ogDescription,
                  ogImage: blog.ogImage,
                  twitterTitle: blog.twitterTitle,
                  twitterDescription: blog.twitterDescription,
                  twitterImage: blog.twitterImage,
                  schemaType: blog.schemaType,
                }}
                onChange={(seoData) => {
                  setBlog({
                    ...blog,
                    ...seoData,
                    seoScore: blog.seoScore || 0,
                  });
                }}
                title={blog.title}
                content={blog.content}
                slug={blog.slug}
              />
            </div>
          ),
          blockTab: (
            <BlockSettings editor={editorInstance} selectedBlock={selectedBlock} />
          ),
        }}
      >
        {/* Editor - Canvas Style with Integrated Title */}
        <RichTextEditor
          content={blog.content || ''}
          onChange={(content) => {
            setBlog({
              ...blog,
              content,
              wordCount: calculateWordCount(content),
            });
            setSavedStatus('unsaved');
          }}
          placeholder="Start writing or type / to choose a block"
          onBlockSelect={setSelectedBlock}
          editorRef={setEditorInstance}
          title={blog.title || ''}
          onTitleChange={handleTitleChange}
        />

        {/* Excerpt */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            value={blog.excerpt || ''}
            onChange={(e) => {
              setBlog({ ...blog, excerpt: e.target.value });
              setSavedStatus('unsaved');
            }}
            placeholder="Write an excerpt (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The excerpt is an optional hand-crafted summary of your content.
          </p>
        </div>
      </EditorLayout>
    </>
  );
}
