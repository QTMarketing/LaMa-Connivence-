'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, Plus, FolderOpen, Tag, 
  BarChart3, Settings, Home, Search, Bell, HelpCircle
} from 'lucide-react';

export default function BlogAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/admin/blog', label: 'All Posts', icon: FileText },
    { href: '/admin/blog/new', label: 'Add New', icon: Plus },
    { href: '/admin/blog/categories', label: 'Categories', icon: FolderOpen },
    { href: '/admin/blog/tags', label: 'Tags', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* WordPress-style Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-semibold text-gray-800 hover:text-blue-600">
              LaMa CMS
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
                <Home size={14} />
                View Site
              </Link>
              <span className="text-gray-300">|</span>
              <span>Welcome, Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <HelpCircle size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* WordPress-style Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)]">
          <nav className="p-3">
            <div className="mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Content
              </h2>
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin/blog' && pathname?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Tools
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <BarChart3 size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
