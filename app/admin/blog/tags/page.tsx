'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, X, Save } from 'lucide-react';
import { tagStorage, blogStorage, type Tag } from '@/lib/blogStorage';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tag>>({
    name: '',
    slug: '',
  });

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredTags(
        tags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(query) ||
            tag.slug.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredTags(tags);
    }
  }, [tags, searchQuery]);

  const loadTags = () => {
    const allTags = tagStorage.getAll();
    setTags(allTags.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      alert('Name and slug are required');
      return;
    }

    // Check for duplicate slug
    const existing = tags.find(
      (t) => t.slug === formData.slug && t.id !== editingId
    );
    if (existing) {
      alert('A tag with this slug already exists');
      return;
    }

    const tag: Tag = {
      id: editingId || `tag-${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      createdAt: editingId
        ? tags.find((t) => t.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tagStorage.save(tag);
    loadTags();
    resetForm();
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      tagStorage.delete(id);
      loadTags();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleBulkDelete = () => {
    // This would need checkbox selection implemented
    alert('Bulk delete feature coming soon');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add tags to organize and group related posts
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add New Tag
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Tag' : 'Add New Tag'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Tag name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The name is how it appears on your site.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) =>
                  setFormData({ ...formData, slug: generateSlug(e.target.value) })
                }
                placeholder="tag-slug"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The "slug" is the URL-friendly version of the name. It is usually all
                lowercase and contains only letters, numbers, and hyphens.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update Tag' : 'Add Tag'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tags Display - WordPress Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {filteredTags.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Tag size={48} className="mx-auto mb-3 text-gray-300" />
            <p>
              {searchQuery
                ? 'No tags found matching your search'
                : 'No tags yet. Create your first tag!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTags.map((tag) => {
              const blogCount = blogStorage.countByTag(tag.id);
              return (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Tag size={18} className="text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {tag.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({blogCount} {blogCount === 1 ? 'post' : 'posts'})
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Slug: <code className="bg-gray-100 px-1 rounded">{tag.slug}</code>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Edit2 size={14} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            <strong>{tags.length}</strong> tag{tags.length !== 1 ? 's' : ''} total
          </div>
        </div>
      </div>
    </div>
  );
}
