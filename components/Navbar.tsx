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
  const [isScrolled, setIsScrolled] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Get services from productData
  const services = getProductsByCategory('services');

  // Track scroll position for morphing animation
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Container sizing - compact fit-content width
  const containerWidth = 'fit-content';
  const maxWidth = 'none';
  
  // Border radius: Only bottom corners rounded, top edge straight
  const borderRadius = '0px 0px 12px 12px';

  return (
    <>
      {/* Logo - Floating on the left side of navbar */}
      <Link
        href="/"
        className="fixed z-[10000] flex items-center transition-all duration-300 hover:scale-105"
        style={{ 
          zIndex: 10000,
          top: '6px',
          left: '40px',
        }}
      >
        <div
          className="rounded-full p-2 shadow-lg"
          style={{
            backgroundColor: isScrolled ? '#FAFAF5' : '#FFFFFF',
            transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: isScrolled 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Image
            src="/Lama.png"
            alt="LaMa Convenience Logo"
            width={70}
            height={70}
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* Navbar: Embedded cut-out (State 1) → Floating pill (State 2) */}
      <header
        className="fixed z-50"
        style={{ 
          position: 'fixed', 
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: containerWidth,
          maxWidth: maxWidth,
          // Background: White in default state, cream/beige when scrolled
          backgroundColor: isScrolled ? '#FAFAF5' : '#FFFFFF',
          borderRadius: borderRadius,
          boxShadow: isScrolled 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
          padding: '12px 20px',
        }}
      >
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          {/* Centered navigation with equal spacing */}
          <nav className="flex items-center justify-center gap-5 xl:gap-7">
              <Link
                href="/about"
                className="text-lg font-medium hover:font-bold hover:text-primary transition-all duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                About
              </Link>

              {/* Services Dropdown */}
              <div className="relative" ref={servicesDropdownRef}>
                <Link
                  href="/services"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="text-lg font-medium hover:font-bold hover:text-primary transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap"
                  style={{ color: '#1A1A1A' }}
                >
                  Services
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: '#FF6B35' }}
                  />
                </Link>
                
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 p-6 z-50"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {services.slice(0, 4).map((service, index) => (
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
                          href="/services"
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
              </div>

              <Link
                href="/deals"
                className="text-lg font-medium hover:font-bold hover:text-primary transition-all duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Deals
              </Link>

              <Link
                href="/rewards"
                className="text-lg font-medium hover:font-bold hover:text-primary transition-all duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Rewards
              </Link>

              <Link
                href="/media/blog"
                className="text-lg font-medium hover:font-bold hover:text-primary transition-all duration-300 whitespace-nowrap"
                style={{ color: '#1A1A1A' }}
              >
                Blog
              </Link>

              {/* Find a Store Button */}
              <Link
                href="/stores"
                className="bg-primary hover:bg-primary-dark text-white px-5 xl:px-6 py-3 rounded-lg text-base font-bold transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: '#FF6B35', color: '#FFFFFF' }}
              >
                Find a Store
                <MapPin size={16} />
              </Link>
            </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-end w-full">
          <button
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
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-20 left-0 right-0 z-40 border-t border-gray-300 bg-[#FAFAF5] overflow-hidden"
            style={{ backgroundColor: '#FAFAF5' }}
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
                  href="/services"
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
              >
                <Link
                  href="/media/blog"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-300 py-3 px-2 block"
                  style={{ color: '#1A1A1A' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
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
    </>
  );
}