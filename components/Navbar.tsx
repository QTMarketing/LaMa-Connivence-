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
  const [navbarHeight, setNavbarHeight] = useState(72);
  const [isMobile, setIsMobile] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  
  // Get services from productData
  const services = getProductsByCategory('services');

  // Organize services into categories for mega-menu
  const serviceCategories = [
    {
      title: 'Financial Services',
      items: services.filter(s => 
        s.name.includes('ATM') || 
        s.name.includes('Money') || 
        s.name.includes('Bill') || 
        s.name.includes('Lottery')
      ),
    },
    {
      title: 'Convenience Services',
      items: services.filter(s => 
        s.name.includes('Restroom') || 
        s.name.includes('Wi-Fi') || 
        s.name.includes('Prepaid') || 
        s.name.includes('Gift')
      ),
    },
    {
      title: 'Vehicle Services',
      items: services.filter(s => 
        s.name.includes('Fuel') || 
        s.name.includes('Car Wash')
      ),
    },
    {
      title: 'More Services',
      items: services.filter(s => {
        const name = s.name.toLowerCase();
        return !name.includes('atm') && 
               !name.includes('money') && 
               !name.includes('bill') && 
               !name.includes('lottery') && 
               !name.includes('prepaid') && 
               !name.includes('gift') && 
               !name.includes('restroom') && 
               !name.includes('wi-fi') && 
               !name.includes('fuel') && 
               !name.includes('car wash');
      }),
    },
  ];

  // Track scroll position for shadow effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  // Calculate navbar height for mobile menu positioning and detect mobile
  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
      setIsMobile(window.innerWidth < 1024);
    };
    
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  // Hover delay logic for mega-menu (prevents flickering)
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Navbar: Full-width top bar with premium design */}
      <header
        ref={navbarRef}
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAFAF5] border-gray-200 shadow-[0px_4px_15px_rgba(0,0,0,0.1)]' 
            : 'bg-white border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Left: Logo with animation */}
          <Link href="/" className="flex items-center justify-center gap-2 group/logo">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -2 }}
              className="transition-transform duration-300"
            >
              <Image
                src="/Lama.png"
                alt="LaMa"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Center: Desktop nav with 7-Eleven scale typography */}
          {/* 7-Eleven Scale: 22-24px, Archivo Narrow, Medium (500), Title Case, -0.02em tracking */}
          <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-9">
            <Link
              href="/about"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
            >
              About
            </Link>

            {/* Services Mega-Menu */}
            <div 
              className="relative" 
              ref={servicesDropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="nav-link-premium relative flex items-center gap-1.5 text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
              >
                Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    servicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Full-Width Mega-Menu */}
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <>
                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 bg-black/20 z-[999]"
                      onClick={() => setServicesDropdownOpen(false)}
                    />
                    
                    {/* Mega-Menu Container */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.16, 1, 0.3, 1] // Apple-style cubic-bezier
                      }}
                      className="fixed top-full left-0 right-0 w-full bg-white border-t border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] z-[1000]"
                      style={{ top: `${navbarRef.current?.offsetHeight || 72}px` }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-[60px] py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                          {serviceCategories.map((category, categoryIndex) => (
                            category.items.length > 0 && (
                              <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: categoryIndex * 0.1 
                                }}
                                className="menu-column"
                              >
                                <ul className="space-y-3">
                                  {category.items.map((service) => (
                                    <li key={service.id}>
                                      <Link
                                        href="/services"
                                        className="text-[17px] font-semibold text-gray-800 hover:text-[#FF6B35] transition-colors duration-200 block py-1.5 mega-menu-link"
                                        onClick={() => setServicesDropdownOpen(false)}
                                      >
                                        {service.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )
                          ))}
                        </div>
                        
                        {/* View All Services Link */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="mt-8 pt-8 border-t border-gray-200"
                        >
                          <Link
                            href="/services"
                            className="text-lg font-bold text-[#FF6B35] hover:underline inline-flex items-center gap-2 transition-all duration-300 group"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            View All Services
                            <ChevronDown size={16} className="rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/deals"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
            >
              Deals
            </Link>
            <Link
              href="/rewards"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
            >
              Rewards
            </Link>
            <span 
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] cursor-default"
              style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
            >
              Delivery
            </span>
            <Link
              href="/media/blog"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-semibold tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-archivo-narrow), sans-serif' }}
            >
              Blog
            </Link>
          </nav>

          {/* Right: Find a Store + mobile menu */}
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/stores"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-white hover:opacity-90 transition-all"
              style={{ 
                fontFamily: 'var(--font-inter), sans-serif',
                backgroundColor: '#FF6B35'
              }}
            >
              <MapPin size={18} />
              Find a Store
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Off-Canvas Design */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-[10000]"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Off-canvas menu sliding from right */}
            <motion.nav
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] z-[10001] bg-white shadow-2xl overflow-y-auto"
            >
              {/* Mobile menu header with close button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold tracking-[0.01em] text-[#1A1A1A]">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile menu content */}
              <div className="px-6 py-6 flex flex-col gap-2">
                {[
                  { href: '/about', label: 'About' },
                  { href: '/deals', label: 'Deals' },
                  { href: '/rewards', label: 'Rewards' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="nav-link-premium-mobile relative text-[16px] font-semibold tracking-[0.01em] text-[#1A1A1A] py-4 block transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="nav-link-premium-mobile relative text-[16px] font-semibold tracking-[0.01em] text-[#1A1A1A] py-4 block cursor-default">
                    Delivery
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="py-2"
                >
                  <Link
                    href="/services"
                    className="nav-link-premium-mobile relative text-[16px] font-semibold tracking-[0.01em] text-[#1A1A1A] py-4 block transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href="/services"
                          className="text-[15px] font-medium text-gray-600 hover:text-[#FF6B35] transition-colors duration-300 py-2 block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {service.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Link
                    href="/media/blog"
                    className="nav-link-premium-mobile relative text-[16px] font-semibold tracking-[0.01em] text-[#1A1A1A] py-4 block transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="mt-4 pt-6 border-t border-gray-200"
                >
                  <Link
                    href="/stores"
                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-4 rounded-lg text-base font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 w-full min-h-[48px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find a Store
                    <MapPin size={18} />
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}