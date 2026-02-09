'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  Eye, EyeOff, Calendar, User, FileText, CheckCircle, XCircle
} from 'lucide-react';
import { blogStorage, type BlogPost } from '@/lib/blogStorage';

export default function BlogListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'trash'>('all');
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  useEffect(() => {
    loadBlogs();
    
    // Listen for updates
    const handleUpdate = () => loadBlogs();
    window.addEventListener('blogsUpdated', handleUpdate);
    return () => window.removeEventListener('blogsUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    let filtered = blogs;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.slug.toLowerCase().includes(query) ||
        b.content.toLowerCase().includes(query)
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, statusFilter, searchQuery]);

  const loadBlogs = () => {
    const allBlogs = blogStorage.getAll();
    setBlogs(allBlogs.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      blogStorage.delete(id);
      loadBlogs();
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`)) {
      selectedBlogs.forEach(id => blogStorage.delete(id));
      setSelectedBlogs([]);
      loadBlogs();
    }
  };

  const getStatusBadge = (status: BlogPost['status']) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      trash: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statusCounts = {
    all: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    draft: blogs.filter(b => b.status === 'draft').length,
    scheduled: blogs.filter(b => b.status === 'scheduled').length,
    trash: blogs.filter(b => b.status === 'trash').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'published', 'draft', 'scheduled', 'trash'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedBlogs.length} post(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedBlogs([])}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBlogs(filteredBlogs.map(b => b.id));
                    } else {
                      setSelectedBlogs([]);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categories</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tags</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SEO Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No posts found</p>
                  <Link
                    href="/admin/blog/new"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Create your first post
                  </Link>
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBlogs([...selectedBlogs, blog.id]);
                        } else {
                          setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <Link
                        href={`/admin/blog/${blog.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {blog.title || '(No title)'}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {blog.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {blog.author}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {blog.category?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {blog.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map(tag => (
                          <span key={tag.id} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(blog.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-2 rounded-full ${
                        blog.seoScore >= 80 ? 'bg-green-500' :
                        blog.seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${blog.seoScore}%` }} />
                      <span className="text-sm text-gray-600">{blog.seoScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {blog.publishedAt 
                      ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {blog.status === 'published' && (
                        <Link
                          href={`/media/blog/${blog.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${blog.id}`}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-gray-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">{statusCounts.draft}</div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{statusCounts.trash}</div>
          <div className="text-sm text-gray-600">Trash</div>
        </div>
      </div>
    </div>
  );
}
