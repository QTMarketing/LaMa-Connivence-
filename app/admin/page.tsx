'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, Check, Eye, Star, AlertCircle, Info, LogOut, Search, Filter, Grid, List, TrendingUp, Tag, Calendar, MapPin, Store as StoreIcon, Phone, Clock, LayoutDashboard, FileText, Settings, Menu, X as XIcon, ShoppingBag, Percent } from 'lucide-react';
import { deals, type Deal } from '@/lib/dealsData';
import { stores, type Store } from '@/lib/storeData';
import { drinks, type Drink } from '@/lib/drinksData';
import Image from 'next/image';

// Helper function to explain where a promo appears across the site
const getPromoLocations = (promo: Deal): string[] => {
  const locations: string[] = [];

  const prettyCategory = promo.category
    .replace('-', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Homepage placements
  if (promo.featured) {
    locations.push('Homepage → Current Promos sections');
  }

  // Deals page – always shows in the grid and its category
  locations.push('Deals page → All Deals grid');
  locations.push(`Deals page → ${prettyCategory} tab`);

  // Deals page featured carousel (top of Deals page)
  if (promo.featured) {
    locations.push('Deals page → Featured promo carousel');
  }

  // Deal detail page – related / More Deals section
  locations.push('Deal detail page → "More Deals" related section');

  return locations;
};

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'promos' | 'stores' | 'drinks'>('promos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Promos state
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDeal, setEditingDeal] = useState<Partial<Deal>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured' | Deal['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Stores state
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [editingStore, setEditingStore] = useState<Partial<Store>>({});
  const [isAddingNewStore, setIsAddingNewStore] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  
  // Drinks state
  const [allDrinks, setAllDrinks] = useState<Drink[]>([]);
  const [editingDrinkId, setEditingDrinkId] = useState<number | null>(null);
  const [editingDrink, setEditingDrink] = useState<Partial<Drink>>({});
  const [isAddingNewDrink, setIsAddingNewDrink] = useState(false);
  const [drinkSearchQuery, setDrinkSearchQuery] = useState('');
  const [drinkFilter, setDrinkFilter] = useState<'all' | 'featured' | Drink['category']>('all');
  const [drinkViewMode, setDrinkViewMode] = useState<'grid' | 'list'>('grid');
  
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
  const [newStore, setNewStore] = useState<Partial<Store>>({
    name: '',
    address: '',
    lat: 0,
    lng: 0,
    phone: '',
    hours: '',
  });
  const [newDrink, setNewDrink] = useState<Partial<Drink>>({
    title: '',
    description: '',
    image: '',
    category: 'buy-2-save',
    savings: '',
    featured: false,
    expirationDate: '',
    price: '',
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

    // Load all stores from localStorage or use default stores
    const savedStores = localStorage.getItem('adminAllStores');
    if (savedStores) {
      try {
        setAllStores(JSON.parse(savedStores));
      } catch {
        setAllStores(stores);
        localStorage.setItem('adminAllStores', JSON.stringify(stores));
      }
    } else {
      setAllStores(stores);
      localStorage.setItem('adminAllStores', JSON.stringify(stores));
    }

    // Load all drinks from localStorage or use default drinks
    const savedDrinks = localStorage.getItem('adminAllDrinks');
    if (savedDrinks) {
      try {
        setAllDrinks(JSON.parse(savedDrinks));
      } catch {
        setAllDrinks(drinks);
        localStorage.setItem('adminAllDrinks', JSON.stringify(drinks));
      }
    } else {
      setAllDrinks(drinks);
      localStorage.setItem('adminAllDrinks', JSON.stringify(drinks));
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

  // Store management functions
  const saveStores = (updatedStores: Store[]) => {
    setAllStores(updatedStores);
    localStorage.setItem('adminAllStores', JSON.stringify(updatedStores));
    window.dispatchEvent(new Event('storesUpdated'));
  };

  const handleEditStore = (store: Store) => {
    setEditingStoreId(store.id);
    setEditingStore({ ...store });
    setIsAddingNewStore(false);
  };

  const handleSaveStore = () => {
    if (editingStoreId) {
      const updated = allStores.map(s => 
        s.id === editingStoreId ? { ...s, ...editingStore } as Store : s
      );
      saveStores(updated);
      setEditingStoreId(null);
      setEditingStore({});
    }
  };

  const handleCancelStore = () => {
    setEditingStoreId(null);
    setEditingStore({});
    setIsAddingNewStore(false);
    setNewStore({
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      phone: '',
      hours: '',
    });
  };

  const handleAddStore = () => {
    if (!newStore.name || !newStore.address || !newStore.phone || !newStore.hours || !newStore.lat || !newStore.lng) {
      alert('Please fill in all required fields (Name, Address, Phone, Hours, Latitude, and Longitude)');
      return;
    }
    
    const newId = allStores.length > 0 ? Math.max(...allStores.map(s => s.id)) + 1 : 1;
    const storeToAdd: Store = {
      id: newId,
      name: newStore.name || '',
      address: newStore.address || '',
      lat: newStore.lat || 0,
      lng: newStore.lng || 0,
      phone: newStore.phone || '',
      hours: newStore.hours || '',
    };
    saveStores([...allStores, storeToAdd]);
    setIsAddingNewStore(false);
    setNewStore({
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      phone: '',
      hours: '',
    });
  };

  const handleDeleteStore = (id: number) => {
    if (confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      saveStores(allStores.filter(s => s.id !== id));
    }
  };

  // Drinks management functions
  const saveDrinks = (updatedDrinks: Drink[]) => {
    setAllDrinks(updatedDrinks);
    localStorage.setItem('adminAllDrinks', JSON.stringify(updatedDrinks));
    window.dispatchEvent(new Event('drinksUpdated'));
  };

  const handleEditDrink = (drink: Drink) => {
    setEditingDrinkId(drink.id);
    setEditingDrink({ ...drink });
    setIsAddingNewDrink(false);
  };

  const handleSaveDrink = () => {
    if (editingDrinkId) {
      const updated = allDrinks.map(d => 
        d.id === editingDrinkId ? { ...d, ...editingDrink } as Drink : d
      );
      saveDrinks(updated);
      setEditingDrinkId(null);
      setEditingDrink({});
    }
  };

  const handleCancelDrink = () => {
    setEditingDrinkId(null);
    setEditingDrink({});
    setIsAddingNewDrink(false);
    setNewDrink({
      title: '',
      description: '',
      image: '',
      category: 'buy-2-save',
      savings: '',
      featured: false,
      expirationDate: '',
      price: '',
    });
  };

  const handleAddDrink = () => {
    if (!newDrink.title || !newDrink.description || !newDrink.image || !newDrink.savings) {
      alert('Please fill in all required fields (Title, Description, Image URL, and Savings)');
      return;
    }
    
    const newId = allDrinks.length > 0 ? Math.max(...allDrinks.map(d => d.id)) + 1 : 1;
    const drinkToAdd: Drink = {
      id: newId,
      title: newDrink.title || '',
      description: newDrink.description || '',
      image: newDrink.image || '',
      category: newDrink.category || 'buy-2-save',
      savings: newDrink.savings || '',
      expirationDate: newDrink.expirationDate || undefined,
      featured: newDrink.featured || false,
      price: newDrink.price || undefined,
    };
    saveDrinks([...allDrinks, drinkToAdd]);
    setIsAddingNewDrink(false);
    setNewDrink({
      title: '',
      description: '',
      image: '',
      category: 'buy-2-save',
      savings: '',
      featured: false,
      expirationDate: '',
      price: '',
    });
  };

  const handleDeleteDrink = (id: number) => {
    if (confirm('Are you sure you want to delete this drink? This action cannot be undone.')) {
      saveDrinks(allDrinks.filter(d => d.id !== id));
    }
  };

  const toggleDrinkFeatured = (id: number) => {
    const updated = allDrinks.map(d => 
      d.id === id ? { ...d, featured: !d.featured } as Drink : d
    );
    saveDrinks(updated);
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

  // Filter stores
  const filteredStores = storeSearchQuery
    ? allStores.filter(store =>
        store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
        store.phone.toLowerCase().includes(storeSearchQuery.toLowerCase())
      )
    : allStores;

  // Filter and search drinks
  let filteredDrinks = drinkFilter === 'all' 
    ? allDrinks 
    : drinkFilter === 'featured'
    ? allDrinks.filter(d => d.featured)
    : allDrinks.filter(d => d.category === drinkFilter);

  if (drinkSearchQuery) {
    filteredDrinks = filteredDrinks.filter(drink =>
      drink.title.toLowerCase().includes(drinkSearchQuery.toLowerCase()) ||
      drink.description.toLowerCase().includes(drinkSearchQuery.toLowerCase()) ||
      drink.category.toLowerCase().includes(drinkSearchQuery.toLowerCase())
    );
  }

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

  const sidebarItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, active: pathname === '/admin' },
    { href: '/admin#promos', label: 'Promos & Deals', icon: Tag, active: pathname === '/admin' && activeTab === 'promos' },
    { href: '/admin#drinks', label: 'Drinks', icon: TrendingUp, active: pathname === '/admin' && activeTab === 'drinks' },
    { href: '/admin#stores', label: 'Store Locations', icon: StoreIcon, active: pathname === '/admin' && activeTab === 'stores' },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText, active: pathname?.startsWith('/admin/blog') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col`} style={{ backgroundColor: '#1A1A1A' }}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-black text-white">Admin</h2>
              <p className="text-xs text-white/60">Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            {sidebarOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.href.includes('#')) {
                    e.preventDefault();
                    const tab = item.href.split('#')[1];
                    setActiveTab(tab as 'promos' | 'stores' | 'drinks');
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                style={isActive ? { color: '#FF6B35' } : {}}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-secondary">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage promos and store locations</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('promos')}
                className={`px-6 py-3 font-bold transition-colors border-b-2 ${
                  activeTab === 'promos'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'promos' ? { borderColor: '#FF6B35', color: '#FF6B35' } : {}}
              >
                <div className="flex items-center gap-2">
                  <Tag size={18} />
                  Promos
                </div>
              </button>
              <button
                onClick={() => setActiveTab('drinks')}
                className={`px-6 py-3 font-bold transition-colors border-b-2 ${
                  activeTab === 'drinks'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'drinks' ? { borderColor: '#FF6B35', color: '#FF6B35' } : {}}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  Drinks
                </div>
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-6 py-3 font-bold transition-colors border-b-2 ${
                  activeTab === 'stores'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'stores' ? { borderColor: '#FF6B35', color: '#FF6B35' } : {}}
              >
                <div className="flex items-center gap-2">
                  <StoreIcon size={18} />
                  Store Locations
                </div>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Promos Tab Content */}
        {activeTab === 'promos' && (
          <>
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
                                Featured promos appear in the Deals page featured carousel and homepage Current Promos sections
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
        </>
        )}

        {/* Stores Tab Content */}
        {activeTab === 'stores' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Stores</p>
                    <p className="text-3xl font-black text-secondary">{allStores.length}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <StoreIcon className="text-primary" size={24} />
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Cities</p>
                    <p className="text-3xl font-black text-secondary">
                      {new Set(allStores.map(s => {
                        const parts = s.address.split(',');
                        return parts.length >= 2 ? parts[1].trim() : '';
                      }).filter(Boolean)).size}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="text-blue-600" size={24} />
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
                    <p className="text-sm font-medium text-gray-600 mb-1">24/7 Locations</p>
                    <p className="text-3xl font-black text-secondary">
                      {allStores.filter(s => s.hours.toLowerCase().includes('24/7')).length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clock className="text-green-600" size={24} />
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
                      placeholder="Search stores by name, address, or phone..."
                      value={storeSearchQuery}
                      onChange={(e) => setStoreSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNewStore(true);
                    setEditingStoreId(null);
                  }}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: '#FF6B35' }}
                >
                  <Plus size={20} />
                  Add New Store
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Showing <strong>{filteredStores.length}</strong> of <strong>{allStores.length}</strong> stores
              </p>
            </div>

            {/* Add New Store Form */}
            <AnimatePresence>
              {isAddingNewStore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-sm border-2 border-primary border-dashed p-8 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-secondary">Add New Store</h3>
                    <button
                      onClick={handleCancelStore}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Store Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="LaMa Downtown"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.phone}
                        onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="(214) 555-0101"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="123 Main St, Dallas, TX 75201"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Latitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.lat || ''}
                        onChange={(e) => setNewStore({ ...newStore, lat: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="32.7767"
                      />
                      <p className="text-xs text-gray-500 mt-1">Get coordinates from Google Maps</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Longitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={newStore.lng || ''}
                        onChange={(e) => setNewStore({ ...newStore, lng: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="-96.7970"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Hours <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStore.hours}
                        onChange={(e) => setNewStore({ ...newStore, hours: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="24/7 or 6AM - 12AM"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleAddStore}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                      style={{ backgroundColor: '#FF6B35' }}
                    >
                      <Check size={20} />
                      Add Store
                    </button>
                    <button
                      onClick={handleCancelStore}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stores List */}
            <div className="space-y-4">
              {filteredStores.map((store) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg border-gray-200"
                >
                  {editingStoreId === store.id ? (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                          <input
                            type="text"
                            value={editingStore.name || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                          <input
                            type="text"
                            value={editingStore.phone || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={editingStore.address || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editingStore.lat || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, lat: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editingStore.lng || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, lng: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Hours</label>
                          <input
                            type="text"
                            value={editingStore.hours || ''}
                            onChange={(e) => setEditingStore({ ...editingStore, hours: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <button
                            onClick={handleSaveStore}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                            style={{ backgroundColor: '#FF6B35' }}
                          >
                            <Save size={20} />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelStore}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                          >
                            <X size={20} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-secondary mb-2">
                            {store.name}
                          </h3>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-start gap-3">
                              <MapPin className="text-primary flex-shrink-0 mt-1" size={18} />
                              <p className="text-sm">{store.address}</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone className="text-primary flex-shrink-0 mt-1" size={18} />
                              <p className="text-sm">{store.phone}</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="text-primary flex-shrink-0 mt-1" size={18} />
                              <p className="text-sm">{store.hours}</p>
                            </div>
                            <div className="flex items-start gap-3 mt-3">
                              <span className="text-xs text-gray-500">
                                Coordinates: {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEditStore(store)}
                          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-gray-200"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="bg-white rounded-md shadow-lg p-12 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">
                  {storeSearchQuery 
                    ? `No stores found matching "${storeSearchQuery}"` 
                    : 'No stores yet. Add your first store!'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Drinks Tab Content */}
        {activeTab === 'drinks' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-md shadow-lg p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Drinks</p>
                    <p className="text-3xl font-black text-secondary">{allDrinks.length}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <TrendingUp className="text-primary" size={24} />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-md shadow-lg p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                    <p className="text-3xl font-black text-secondary">{allDrinks.filter(d => d.featured).length}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Star className="text-primary" size={24} />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-md shadow-lg p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Buy 2 & Save</p>
                    <p className="text-3xl font-black text-secondary">{allDrinks.filter(d => d.category === 'buy-2-save').length}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <ShoppingBag className="text-primary" size={24} />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                    <p className="text-3xl font-black text-secondary">{new Set(allDrinks.map(d => d.category)).size}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Tag className="text-primary" size={24} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-md shadow-lg p-6 mb-8 border-2 border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search drinks..."
                      value={drinkSearchQuery}
                      onChange={(e) => setDrinkSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={drinkFilter}
                    onChange={(e) => setDrinkFilter(e.target.value as 'all' | 'featured' | Drink['category'])}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-bold"
                  >
                    <option value="all">All Drinks</option>
                    <option value="featured">Featured</option>
                    <option value="buy-2-save">Buy 2 & Save</option>
                    <option value="discounted">Discounted</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setDrinkViewMode('grid')}
                      className={`p-2 rounded transition-all ${drinkViewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setDrinkViewMode('list')}
                      className={`p-2 rounded transition-all ${drinkViewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsAddingNewDrink(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    <Plus size={20} />
                    Add Drink
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Showing <strong>{filteredDrinks.length}</strong> of <strong>{allDrinks.length}</strong> drinks
              </p>
            </div>

            {/* Add New Drink Form */}
            <AnimatePresence>
              {isAddingNewDrink && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-md shadow-lg p-8 mb-8 border-2 border-primary"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-secondary">Add New Drink</h2>
                    <button
                      onClick={handleCancelDrink}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={newDrink.title || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="e.g., Coca-Cola 2-Pack Deal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                      <select
                        value={newDrink.category || 'buy-2-save'}
                        onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value as Drink['category'] })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="buy-2-save">Buy 2 & Save</option>
                        <option value="discounted">Discounted</option>
                        <option value="seasonal">Seasonal</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={newDrink.description || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        rows={3}
                        placeholder="Describe the drink deal..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
                      <input
                        type="text"
                        value={newDrink.image || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, image: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Savings *</label>
                      <input
                        type="text"
                        value={newDrink.savings || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, savings: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="e.g., Save $1.50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price (Optional)</label>
                      <input
                        type="text"
                        value={newDrink.price || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="e.g., $4.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Expiration Date (Optional)</label>
                      <input
                        type="date"
                        value={newDrink.expirationDate || ''}
                        onChange={(e) => setNewDrink({ ...newDrink, expirationDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={newDrink.featured || false}
                          onChange={(e) => setNewDrink({ ...newDrink, featured: e.target.checked })}
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <div>
                          <span className="font-bold text-gray-900">Featured Drink</span>
                          <p className="text-sm text-gray-600">
                            Featured drinks appear prominently on the Drinks page
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        onClick={handleAddDrink}
                        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        style={{ backgroundColor: '#FF6B35' }}
                      >
                        <Plus size={20} />
                        Add Drink
                      </button>
                      <button
                        onClick={handleCancelDrink}
                        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drinks Grid/List */}
            {filteredDrinks.length > 0 ? (
              <div className={drinkViewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredDrinks.map((drink) => (
                  <motion.div
                    key={drink.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg border-gray-200"
                  >
                    {editingDrinkId === drink.id ? (
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                            <input
                              type="text"
                              value={editingDrink.title ?? drink.title}
                              onChange={(e) => setEditingDrink({ ...editingDrink, title: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select
                              value={editingDrink.category ?? drink.category}
                              onChange={(e) => setEditingDrink({ ...editingDrink, category: e.target.value as Drink['category'] })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            >
                              <option value="buy-2-save">Buy 2 & Save</option>
                              <option value="discounted">Discounted</option>
                              <option value="seasonal">Seasonal</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                              value={editingDrink.description ?? drink.description}
                              onChange={(e) => setEditingDrink({ ...editingDrink, description: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                            <input
                              type="text"
                              value={editingDrink.image ?? drink.image}
                              onChange={(e) => setEditingDrink({ ...editingDrink, image: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Savings</label>
                            <input
                              type="text"
                              value={editingDrink.savings ?? drink.savings}
                              onChange={(e) => setEditingDrink({ ...editingDrink, savings: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price (Optional)</label>
                            <input
                              type="text"
                              value={editingDrink.price ?? drink.price ?? ''}
                              onChange={(e) => setEditingDrink({ ...editingDrink, price: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expiration Date</label>
                            <input
                              type="date"
                              value={editingDrink.expirationDate ?? drink.expirationDate ?? ''}
                              onChange={(e) => setEditingDrink({ ...editingDrink, expirationDate: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={editingDrink.featured ?? drink.featured}
                                onChange={(e) => setEditingDrink({ ...editingDrink, featured: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                              />
                              <div>
                                <span className="font-bold text-gray-900">Featured Drink</span>
                                <p className="text-sm text-gray-600">
                                  Featured drinks appear prominently on the Drinks page
                                </p>
                              </div>
                            </label>
                          </div>
                          <div className="md:col-span-2 flex gap-4">
                            <button
                              onClick={handleSaveDrink}
                              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                              style={{ backgroundColor: '#FF6B35' }}
                            >
                              <Save size={20} />
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelDrink}
                              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold transition-all hover:bg-gray-300"
                            >
                              <X size={20} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={drinkViewMode === 'grid' ? 'p-6' : 'p-6 flex gap-6'}>
                        <div className={`relative ${drinkViewMode === 'grid' ? 'w-full aspect-video mb-4' : 'w-48 h-48 flex-shrink-0'} rounded-lg overflow-hidden bg-gray-100`}>
                          <Image
                            src={drink.image}
                            alt={drink.title}
                            fill
                            className="object-cover"
                          />
                          {drink.featured && (
                            <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                              <Star size={12} fill="currentColor" />
                              FEATURED
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-black text-secondary mb-1">{drink.title}</h3>
                              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg mb-2">
                                {drink.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleDrinkFeatured(drink.id)}
                                className={`p-2 rounded-lg transition-all ${
                                  drink.featured ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={drink.featured ? 'Remove from featured' : 'Mark as featured'}
                              >
                                <Star size={18} fill={drink.featured ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={() => handleEditDrink(drink)}
                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                                title="Edit drink"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteDrink(drink.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                title="Delete drink"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{drink.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            {drink.savings && (
                              <span className="px-3 py-1 bg-orange-100 text-primary font-bold rounded-lg">
                                {drink.savings}
                              </span>
                            )}
                            {drink.price && (
                              <span className="text-gray-700 font-semibold">{drink.price}</span>
                            )}
                            {drink.expirationDate && (
                              <span className="text-gray-500 flex items-center gap-1">
                                <Calendar size={14} />
                                Expires: {new Date(drink.expirationDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-md shadow-lg p-12 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">
                  {drinkSearchQuery 
                    ? `No drinks found matching "${drinkSearchQuery}"` 
                    : 'No drinks yet. Add your first drink!'}
                </p>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
