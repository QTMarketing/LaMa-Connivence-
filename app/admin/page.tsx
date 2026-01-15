'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, Check, Eye, Star, AlertCircle, Info, LogOut, Search, Filter, Grid, List, TrendingUp, Tag, Calendar } from 'lucide-react';
import { deals, type Deal } from '@/lib/dealsData';
import Image from 'next/image';

// Helper function to get where a promo appears
const getPromoLocations = (promo: Deal): string[] => {
  const locations: string[] = [];
  
  if (promo.featured) {
    locations.push('Featured Deals Carousel');
    locations.push('Homepage Promo Cards');
  }
  
  locations.push('Deals Page (All Deals Grid)');
  locations.push(`Deals Page (${promo.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Category)`);
  locations.push('Deal Detail Pages (More Deals Section)');
  
  if (promo.featured) {
    locations.push('Services Page (Featured Carousel)');
    locations.push('Other Pages (Featured Carousel)');
  }
  
  return locations;
};

export default function AdminPage() {
  const router = useRouter();
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDeal, setEditingDeal] = useState<Partial<Deal>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured' | Deal['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    title: '',
    description: '',
    image: '',
    category: 'meal-deals',
    savings: '',
    featured: false,
    expirationDate: '',
  });

  useEffect(() => {
    // Check authentication
    const authStatus = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!authStatus) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);

    // Load all deals from localStorage or use default deals
    const savedDeals = localStorage.getItem('adminAllDeals');
    if (savedDeals) {
      try {
        setAllDeals(JSON.parse(savedDeals));
      } catch {
        setAllDeals(deals);
        localStorage.setItem('adminAllDeals', JSON.stringify(deals));
      }
    } else {
      setAllDeals(deals);
      localStorage.setItem('adminAllDeals', JSON.stringify(deals));
    }
  }, [router]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('adminAuthenticated');
      router.push('/admin/login');
    }
  };

  const saveDeals = (updatedDeals: Deal[]) => {
    setAllDeals(updatedDeals);
    localStorage.setItem('adminAllDeals', JSON.stringify(updatedDeals));
    window.dispatchEvent(new Event('promosUpdated'));
    window.dispatchEvent(new Event('allDealsUpdated'));
  };

  const handleEdit = (deal: Deal) => {
    setEditingId(deal.id);
    setEditingDeal({ ...deal });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (editingId) {
      const updated = allDeals.map(d => 
        d.id === editingId ? { ...d, ...editingDeal } as Deal : d
      );
      saveDeals(updated);
      setEditingId(null);
      setEditingDeal({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingDeal({});
    setIsAddingNew(false);
    setNewDeal({
      title: '',
      description: '',
      image: '',
      category: 'meal-deals',
      savings: '',
      featured: false,
      expirationDate: '',
    });
  };

  const handleAdd = () => {
    if (!newDeal.title || !newDeal.description || !newDeal.image || !newDeal.savings) {
      alert('Please fill in all required fields (Title, Description, Image URL, and Savings)');
      return;
    }
    
    const newId = allDeals.length > 0 ? Math.max(...allDeals.map(d => d.id)) + 1 : 1;
    const dealToAdd: Deal = {
      id: newId,
      title: newDeal.title || '',
      description: newDeal.description || '',
      image: newDeal.image || '',
      category: newDeal.category || 'meal-deals',
      savings: newDeal.savings || '',
      expirationDate: newDeal.expirationDate || undefined,
      featured: newDeal.featured || false,
    };
    saveDeals([...allDeals, dealToAdd]);
    setIsAddingNew(false);
    setNewDeal({
      title: '',
      description: '',
      image: '',
      category: 'meal-deals',
      savings: '',
      featured: false,
      expirationDate: '',
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this promo? This action cannot be undone.')) {
      saveDeals(allDeals.filter(d => d.id !== id));
    }
  };

  const toggleFeatured = (id: number) => {
    const updated = allDeals.map(d => 
      d.id === id ? { ...d, featured: !d.featured } as Deal : d
    );
    saveDeals(updated);
  };

  // Filter and search deals
  let filteredDeals = filter === 'all' 
    ? allDeals 
    : filter === 'featured'
    ? allDeals.filter(d => d.featured)
    : allDeals.filter(d => d.category === filter);

  if (searchQuery) {
    filteredDeals = filteredDeals.filter(deal =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Statistics
  const stats = {
    total: allDeals.length,
    featured: allDeals.filter(d => d.featured).length,
    active: allDeals.filter(d => !d.expirationDate || new Date(d.expirationDate) > new Date()).length,
    categories: new Set(allDeals.map(d => d.category)).size,
  };

  const categories: Array<{ value: Deal['category'] | 'all' | 'featured', label: string }> = [
    { value: 'all', label: 'All Promos' },
    { value: 'featured', label: 'Featured' },
    { value: 'meal-deals', label: 'Meal Deals' },
    { value: 'daily-specials', label: 'Daily Specials' },
    { value: 'weekly-promotions', label: 'Weekly Promotions' },
    { value: 'combo-offers', label: 'Combo Offers' },
  ];

  // Show loading or nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-secondary">Promo Management</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Promos</p>
                <p className="text-3xl font-black text-secondary">{stats.total}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Tag className="text-primary" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                <p className="text-3xl font-black text-secondary">{stats.featured}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="text-yellow-600" size={24} fill="currentColor" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-black text-secondary">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-3xl font-black text-secondary">{stats.categories}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Filter className="text-blue-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search promos by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setEditingId(null);
                }}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105"
                style={{ backgroundColor: '#FF6B35' }}
              >
                <Plus size={20} />
                Add New Promo
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filter === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={filter === cat.value ? { backgroundColor: '#FF6B35' } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Showing <strong>{filteredDeals.length}</strong> of <strong>{allDeals.length}</strong> promos
            </p>
          </div>
        </div>

        {/* Add New Promo Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border-2 border-primary border-dashed p-8 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-secondary">Add New Promo</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Coffee & Breakfast Combo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDeal.image}
                    onChange={(e) => setNewDeal({ ...newDeal, image: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newDeal.description}
                    onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    rows={3}
                    placeholder="Any coffee plus breakfast sandwich for just $5.99..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newDeal.category}
                    onChange={(e) => setNewDeal({ ...newDeal, category: e.target.value as Deal['category'] })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="meal-deals">Meal Deals</option>
                    <option value="daily-specials">Daily Specials</option>
                    <option value="weekly-promotions">Weekly Promotions</option>
                    <option value="combo-offers">Combo Offers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Savings <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDeal.savings}
                    onChange={(e) => setNewDeal({ ...newDeal, savings: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Save $2.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={newDeal.expirationDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expirationDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={newDeal.featured}
                      onChange={(e) => setNewDeal({ ...newDeal, featured: e.target.checked })}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <div>
                      <span className="font-bold text-gray-900">Featured Promo</span>
                      <p className="text-sm text-gray-600">
                        Featured promos appear in carousels on homepage, deals page, services page, and other pages
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: '#FF6B35' }}
                >
                  <Check size={20} />
                  Add Promo
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promos Grid/List */}
        {filteredDeals.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            {filteredDeals.map((deal) => {
              const locations = getPromoLocations(deal);
              return (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all hover:shadow-md ${
                    deal.featured ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  {editingId === deal.id ? (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={editingDeal.title || ''}
                            onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                          <input
                            type="text"
                            value={editingDeal.image || ''}
                            onChange={(e) => setEditingDeal({ ...editingDeal, image: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                          <textarea
                            value={editingDeal.description || ''}
                            onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                          <select
                            value={editingDeal.category || deal.category}
                            onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value as Deal['category'] })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          >
                            <option value="meal-deals">Meal Deals</option>
                            <option value="daily-specials">Daily Specials</option>
                            <option value="weekly-promotions">Weekly Promotions</option>
                            <option value="combo-offers">Combo Offers</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Savings</label>
                          <input
                            type="text"
                            value={editingDeal.savings || ''}
                            onChange={(e) => setEditingDeal({ ...editingDeal, savings: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Expiration Date</label>
                          <input
                            type="date"
                            value={editingDeal.expirationDate || ''}
                            onChange={(e) => setEditingDeal({ ...editingDeal, expirationDate: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={editingDeal.featured ?? deal.featured}
                              onChange={(e) => setEditingDeal({ ...editingDeal, featured: e.target.checked })}
                              className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <div>
                              <span className="font-bold text-gray-900">Featured Promo</span>
                              <p className="text-sm text-gray-600">
                                Featured promos appear in carousels across the website
                              </p>
                            </div>
                          </label>
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                            style={{ backgroundColor: '#FF6B35' }}
                          >
                            <Save size={20} />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                          >
                            <X size={20} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'p-6' : 'p-6 flex gap-6'}>
                      <div className={`relative ${viewMode === 'grid' ? 'w-full aspect-video mb-4' : 'w-48 h-48 flex-shrink-0'} rounded-lg overflow-hidden bg-gray-100`}>
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                        {deal.featured && (
                          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <Star size={12} fill="currentColor" />
                            FEATURED
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-secondary mb-2">
                              {deal.title}
                            </h3>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase">
                                {deal.category.replace('-', ' ')}
                              </span>
                              <span className="text-primary font-bold">{deal.savings}</span>
                              {deal.expirationDate && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(deal.expirationDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>

                        {/* Where This Promo Appears */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye size={14} className="text-gray-600" />
                            <span className="text-xs font-bold text-gray-700">Appears on:</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {locations.slice(0, 3).map((location, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                {location}
                              </li>
                            ))}
                            {locations.length > 3 && (
                              <li className="text-gray-500">+{locations.length - 3} more locations</li>
                            )}
                          </ul>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-gray-200"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => toggleFeatured(deal.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                              deal.featured
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={deal.featured ? { color: '#FF6B35' } : {}}
                          >
                            <Star size={16} fill={deal.featured ? 'currentColor' : 'none'} />
                            {deal.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-red-200"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg mb-2">
              {searchQuery 
                ? `No promos found matching "${searchQuery}"` 
                : filter === 'all' 
                  ? 'No promos yet. Add your first promo!' 
                  : `No ${filter === 'featured' ? 'featured' : filter} promos found.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
