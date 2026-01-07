'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { getProductsByCategory } from '@/lib/productData';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const mediaDropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Get services from productData
  const services = getProductsByCategory('services');

  // Update navbar style on scroll
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (mediaDropdownRef.current && !mediaDropdownRef.current.contains(event.target as Node)) {
        setMediaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        width: '100%',
        margin: 0,
        padding: 0
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between relative">
          {/* Logo - Left Top Corner, Same Line as Navbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block absolute left-4 md:left-6"
          >
            <Link 
              href="/" 
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              {/* Logo Image Placeholder - Replace with actual logo image */}
              <Image
                src="/lama-logo.png"
                alt="LaMa Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  // Fallback to text logo if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling;
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              {/* Fallback text logo - shown if image doesn't exist */}
              <div className="text-xl font-black flex items-center gap-1" style={{ display: 'none' }}>
                <span className="text-white">LA</span>
                <span className="text-primary" style={{ color: '#FF6B35' }}>MA</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Light Beige Background with Black Text, Centered - Matching Reference Shape */}
          <nav className={`hidden lg:flex items-center gap-8 xl:gap-10 rounded-2xl px-8 xl:px-10 py-4 shadow-lg transition-all duration-300 mx-auto ${
            isScrolled 
              ? 'bg-[#F5F5DC]/95 backdrop-blur-md' 
              : 'bg-[#F5F5DC]/95 backdrop-blur-sm'
          }`}
          style={{ backgroundColor: 'rgba(245, 245, 220, 0.95)', minWidth: 'fit-content', maxWidth: '90%' }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                href="/about"
                className="text-base font-medium text-secondary hover:text-primary transition-colors duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                About
              </Link>
            </motion.div>

            {/* Services Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
              ref={servicesDropdownRef}
            >
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="text-base font-medium text-secondary hover:text-primary transition-colors duration-300 flex items-center gap-1.5 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Services
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 text-primary ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#FF6B35' }}
                />
              </button>
              
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 p-6"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {services.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Link
                            href={`/products/services#service-${service.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
                              {service.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <Link
                        href="/products/services"
                        className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1 transition-all duration-300 group"
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        View All Services
                        <ChevronDown size={14} className="rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/deals"
                className="text-base font-medium text-secondary hover:text-primary transition-colors duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Deals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Link
                href="/rewards"
                className="text-base font-medium text-secondary hover:text-primary transition-colors duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Rewards
              </Link>
            </motion.div>

            {/* Media Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
              ref={mediaDropdownRef}
            >
              <button
                onMouseEnter={() => setMediaDropdownOpen(true)}
                onMouseLeave={() => setMediaDropdownOpen(false)}
                className="text-base font-medium text-secondary hover:text-primary transition-colors duration-300 flex items-center gap-1.5 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Media
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 text-primary ${mediaDropdownOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#FF6B35' }}
                />
              </button>
              
              <AnimatePresence>
                {mediaDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-4 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 py-2"
                    onMouseEnter={() => setMediaDropdownOpen(true)}
                    onMouseLeave={() => setMediaDropdownOpen(false)}
                  >
                    {[
                      { href: '/media/blog', label: 'Blog' },
                      { href: '/media/press-room', label: 'Press Room' }
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary transition-all duration-300"
                          onClick={() => setMediaDropdownOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Find a Store Button - Orange Background with White Text */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link
                href="/stores"
                className="bg-primary hover:bg-primary-dark text-white px-6 xl:px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap hover:scale-105"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Find a Store
                <MapPin size={16} />
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Logo and Menu Button */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/" 
                className="text-2xl font-black flex items-center gap-1"
              >
                <span className="text-white">LA</span>
                <span className="text-primary" style={{ color: '#FF6B35' }}>MA</span>
              </Link>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-secondary p-2 rounded-md text-white hover:bg-secondary/90 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-300 bg-[#F5F5DC] overflow-hidden"
            style={{ backgroundColor: '#F5F5DC' }}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-1">
              {[
                { href: '/about', label: 'About' },
                { href: '/deals', label: 'Deals' },
                { href: '/rewards', label: 'Rewards' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-300 py-3 px-2 block"
                    style={{ color: '#1A1A1A' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="py-2"
              >
                <Link
                  href="/products/services"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-300 py-3 px-2 block"
                  style={{ color: '#1A1A1A' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                    >
                      <Link
                        href={`/products/services#service-${service.id}`}
                        className="text-xs text-gray-600 hover:text-primary transition-colors duration-300 py-2 px-2 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="py-2"
              >
                <span className="text-sm font-medium text-secondary py-3 px-2 block" style={{ color: '#1A1A1A' }}>Media</span>
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {[
                    { href: '/media/blog', label: 'Blog' },
                    { href: '/media/press-room', label: 'Press Room' }
                  ].map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-xs text-gray-600 hover:text-primary transition-colors duration-300 py-2 px-2 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Link
                  href="/stores"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 mt-2 w-full hover:scale-105"
                  style={{ backgroundColor: '#FF6B35' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find a Store
                  <MapPin size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
