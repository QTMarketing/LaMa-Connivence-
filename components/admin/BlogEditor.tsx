'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, Calendar, User, X } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { format } from 'date-fns';

import BlockSettings from '@/components/admin/BlockSettings';
import EditorLayout from '@/components/admin/EditorLayout';
import ImageField from '@/components/admin/ImageField';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SEOPanel, { type SEOData } from '@/components/admin/SEOPanel';
import {
  countWords,
  slugify,
  type BlogEditView,
  type BlogStatus,
  type TaxonomyTerm,
} from '@/lib/blog/types';

interface BlogEditorProps {
  /** Omitted when creating. */
  post?: BlogEditView;
  categories: TaxonomyTerm[];
  tags: TaxonomyTerm[];
}

type Draft = Omit<BlogEditView, 'id' | 'category' | 'tags' | 'updatedAt'>;

function emptyDraft(): Draft {
  return {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'LaMa Team',
    publishedAt: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    robotsIndex: true,
    robotsFollow: true,
    robotsNoArchive: false,
    robotsNoSnippet: false,
    wordCount: 0,
    categoryId: null,
  };
}

function toDraft(post: BlogEditView): Draft {
  const { id, category, tags, updatedAt, ...rest } = post;
  return rest;
}

export default function BlogEditor({
  post,
  categories: initialCategories,
  tags: initialTags,
}: BlogEditorProps) {
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(
    post ? toDraft(post) : emptyDraft(),
  );
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.tags.map((tag) => tag.id) ?? [],
  );
  const [newTagName, setNewTagName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    post ? 'saved' : 'unsaved',
  );
  const [error, setError] = useState<string | null>(null);
  const [seoScore, setSeoScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<{
    type: string;
    node: unknown;
    position: number;
  } | null>(null);
  const [editorInstance, setEditorInstance] = useState<Parameters<
    NonNullable<Parameters<typeof RichTextEditor>[0]['editorRef']>
  >[0]>(null);

  const update = (changes: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setSavedStatus('unsaved');
  };

  const handleTitleChange = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      // The slug only tracks the title until the post is first saved; changing
      // it afterwards would break every link already published.
      slug: post ? current.slug : slugify(title),
    }));
    setSavedStatus('unsaved');
  };

  const save = async (status: BlogStatus) => {
    setIsSaving(true);
    setSavedStatus('saving');
    setError(null);

    const response = await fetch(
      post ? `/api/admin/blog/${post.id}` : '/api/admin/blog',
      {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, status, tagIds: selectedTagIds }),
      },
    ).catch(() => null);

    setIsSaving(false);

    if (!response?.ok) {
      const data = await response?.json().catch(() => ({}));
      setSavedStatus('unsaved');
      setError(data?.error ?? 'Could not save the post.');
      return;
    }

    setDraft((current) => ({ ...current, status }));
    setSavedStatus('saved');

    const data = await response.json().catch(() => ({}));

    if (!post && data.post?.id) {
      // Move off /new so a second save updates rather than duplicates.
      router.replace(`/admin/blog/${data.post.id}`);
      return;
    }

    router.refresh();
  };

  const addTerm = async (type: 'category' | 'tag', name: string) => {
    if (!name.trim()) return;

    const response = await fetch('/api/admin/blog/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name }),
    }).catch(() => null);

    const data = await response?.json().catch(() => ({}));

    if (!response?.ok || !data?.term) {
      setError(data?.error ?? `Could not add the ${type}.`);
      return;
    }

    if (type === 'category') {
      setCategories((current) =>
        current.some((term) => term.id === data.term.id)
          ? current
          : [...current, data.term],
      );
      update({ categoryId: data.term.id });
      setNewCategoryName('');
    } else {
      setTags((current) =>
        current.some((term) => term.id === data.term.id)
          ? current
          : [...current, data.term],
      );
      setSelectedTagIds((current) =>
        current.includes(data.term.id) ? current : [...current, data.term.id],
      );
      setNewTagName('');
    }
  };

  const handleSeoChange = (seo: SEOData) => update(seo as Partial<Draft>);

  // Stable identity, otherwise SEOPanel's effect would re-run every render.
  const handleScoreChange = useCallback((score: number) => {
    setSeoScore(score);
  }, []);

  useEffect(() => {
    const openPreview = () => setShowPreview(true);
    window.addEventListener('openBlogPreview', openPreview);
    return () => window.removeEventListener('openBlogPreview', openPreview);
  }, []);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  return (
    <>
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-md p-2 hover:bg-gray-100"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {draft.featuredImage && (
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={draft.featuredImage}
                    alt={draft.title || 'Post preview'}
                    fill
                    className="object-cover"
                    sizes="896px"
                  />
                </div>
              )}

              <h1 className="mb-4 text-4xl font-black text-gray-900">
                {draft.title || 'Untitled post'}
              </h1>

              <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {draft.publishedAt
                    ? format(new Date(draft.publishedAt), 'MMM d, yyyy')
                    : 'Not published yet'}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {draft.author}
                </span>
              </div>

              {draft.excerpt && (
                <div className="mb-6 rounded-lg border-l-4 border-primary bg-gray-50 p-4">
                  <p className="text-lg italic text-gray-700">{draft.excerpt}</p>
                </div>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: draft.content
                    ? DOMPurify.sanitize(draft.content)
                    : '<p class="text-gray-500 italic">No content yet.</p>',
                }}
              />

              {selectedTags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
                  <span className="text-sm font-semibold text-gray-700">
                    Tags:
                  </span>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {draft.slug && (
                <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                  URL:{' '}
                  <code className="rounded bg-gray-100 px-2 py-1">
                    /media/blog/{draft.slug}
                  </code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <EditorLayout
        title={draft.title}
        onTitleChange={handleTitleChange}
        onSave={() => save('draft')}
        onPublish={() => save('published')}
        isSaving={isSaving}
        seoScore={seoScore}
        savedStatus={savedStatus}
        editor={editorInstance}
        onImageInsert={() => window.dispatchEvent(new CustomEvent('openImageModal'))}
        rightSidebarContent={{
          postTab: (
            <div className="space-y-6">
              {error && (
                <p
                  className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Publish
                </h3>
                <label
                  htmlFor="post-status"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="post-status"
                  value={draft.status}
                  onChange={(e) =>
                    update({ status: e.target.value as BlogStatus })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="trash">Trash</option>
                </select>
                {draft.publishedAt && (
                  <p className="mt-2 text-xs text-gray-600">
                    Published{' '}
                    {format(new Date(draft.publishedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-600">
                  {countWords(draft.content)} words
                </p>
              </div>

              <div>
                <label
                  htmlFor="post-author"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  id="post-author"
                  value={draft.author}
                  onChange={(e) => update({ author: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="post-slug"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  URL slug
                </label>
                <input
                  id="post-slug"
                  value={draft.slug}
                  onChange={(e) => update({ slug: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-gray-500">
                  /media/blog/{draft.slug || '…'}
                </p>
              </div>

              <ImageField
                value={draft.featuredImage}
                onChange={(url) => update({ featuredImage: url })}
                folder="blog"
                label="Featured image"
              />

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Category
                </h3>
                <select
                  value={draft.categoryId ?? ''}
                  onChange={(e) =>
                    update({ categoryId: e.target.value || null })
                  }
                  aria-label="Category"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="mt-2 flex gap-2">
                  <input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category"
                    aria-label="New category name"
                    className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => addTerm('category', newCategoryName)}
                    className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Tags</h3>
                <div className="space-y-2">
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-500">No tags yet.</p>
                  )}
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={(e) => {
                          setSelectedTagIds((current) =>
                            e.target.checked
                              ? [...current, tag.id]
                              : current.filter((id) => id !== tag.id),
                          );
                          setSavedStatus('unsaved');
                        }}
                        className="rounded border-gray-300 accent-primary"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-2 flex gap-2">
                  <input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag"
                    aria-label="New tag name"
                    className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => addTerm('tag', newTagName)}
                    className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              <SEOPanel
                data={{
                  seoTitle: draft.seoTitle,
                  seoDescription: draft.seoDescription,
                  focusKeyword: draft.focusKeyword,
                  canonicalUrl: draft.canonicalUrl,
                  robotsIndex: draft.robotsIndex,
                  robotsFollow: draft.robotsFollow,
                  robotsNoArchive: draft.robotsNoArchive,
                  robotsNoSnippet: draft.robotsNoSnippet,
                  ogTitle: draft.ogTitle,
                  ogDescription: draft.ogDescription,
                  ogImage: draft.ogImage,
                  twitterTitle: draft.twitterTitle,
                  twitterDescription: draft.twitterDescription,
                  twitterImage: draft.twitterImage,
                }}
                onChange={handleSeoChange}
                onScoreChange={handleScoreChange}
                title={draft.title}
                content={draft.content}
                slug={draft.slug}
              />
            </div>
          ),
          blockTab: (
            <BlockSettings editor={editorInstance} selectedBlock={selectedBlock} />
          ),
        }}
      >
        <RichTextEditor
          content={post?.content ?? ''}
          onChange={(content) => update({ content })}
          placeholder="Start writing or type / to choose a block"
          onBlockSelect={setSelectedBlock}
          editorRef={setEditorInstance}
          title={draft.title}
          onTitleChange={handleTitleChange}
        />

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <label
            htmlFor="post-excerpt"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Excerpt
          </label>
          <textarea
            id="post-excerpt"
            value={draft.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            placeholder="A short summary, shown on cards and in search results."
            rows={3}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </EditorLayout>
    </>
  );
}
