'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ExternalLink, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';

import {
  BLOG_STATUSES,
  formatBlogDate,
  type BlogStatus,
  type BlogSummary,
} from '@/lib/blog/types';

const STATUS_STYLES: Record<BlogStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  trash: 'bg-red-100 text-red-800',
};

export default function BlogAdmin({
  initialPosts,
}: {
  initialPosts: BlogSummary[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<'all' | BlogStatus>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const tally = { all: posts.length } as Record<'all' | BlogStatus, number>;
    for (const status of BLOG_STATUSES) {
      tally[status] = posts.filter((post) => post.status === status).length;
    }
    return tally;
  }, [posts]);

  const visible =
    filter === 'all' ? posts : posts.filter((post) => post.status === filter);

  async function remove(post: BlogSummary) {
    if (
      !window.confirm(
        `Permanently delete "${post.title}"? Set the status to Trash instead if you might want it back.`,
      )
    ) {
      return;
    }

    setError(null);
    setBusyId(post.id);
    const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' });
    setBusyId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the post.');
      return;
    }

    setPosts((current) => current.filter((item) => item.id !== post.id));
  }

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Blog</h1>
          <p className="mt-1 text-sm text-gray-600">
            {counts.published} published, {counts.draft} draft
            {counts.draft === 1 ? '' : 's'}.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          New post
        </Link>
      </header>

      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {(['all', ...BLOG_STATUSES] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status} ({counts[status]})
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        {visible.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            {posts.length === 0
              ? 'No posts yet. Write the first one.'
              : 'No posts with that status.'}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Category
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Author
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Published
                </th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-semibold text-gray-900 hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      /media/blog/{post.slug} · {post.wordCount} words
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[post.status]}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {post.categoryName ?? '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {post.author}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {post.publishedAt ? formatBlogDate(post.publishedAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === 'published' && (
                        <Link
                          href={`/media/blog/${post.slug}`}
                          target="_blank"
                          className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                          aria-label={`View ${post.title} on the site`}
                        >
                          <ExternalLink size={16} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => remove(post)}
                        disabled={busyId === post.id}
                        className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${post.title}`}
                      >
                        {busyId === post.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
