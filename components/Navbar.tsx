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
  const { scrollY } = useScroll();
  
  // Get services from productData
  const services = getProductsByCategory('services');

  // Track scroll position for morphing animation
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

  return (
    <>
      {/* Navbar: Full-width top bar like 7-Eleven */}
      <header
        ref={navbarRef}
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
          isScrolled ? 'bg-[#FAFAF5] shadow-md border-gray-200' : 'bg-white border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Lama.png"
              alt="LaMa"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[0.95rem] xl:text-base font-semibold tracking-[0.12em] uppercase">
            <Link
              href="/about"
              className="hover:text-[#FF6B35] transition-colors"
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                type="button"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="flex items-center gap-1.5 hover:text-[#FF6B35] transition-colors"
              >
                Services
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    servicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 p-4 md:p-6 z-50"
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
                            href="/services"
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
                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#FF6B35] transition-colors duration-300">
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
                        className="text-sm font-bold text-[#FF6B35] hover:underline inline-flex items-center gap-1 transition-all duration-300 group"
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
              className="hover:text-[#FF6B35] transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/rewards"
              className="hover:text-[#FF6B35] transition-colors"
            >
              Rewards
            </Link>
            <Link
              href="/media/blog"
              className="hover:text-[#FF6B35] transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Right: Find a Store + mobile menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/stores"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-black text-white hover:bg-gray-900 transition-colors"
            >
              <MapPin size={16} />
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed left-0 right-0 z-[10001] border-t border-gray-300 overflow-hidden shadow-lg"
            style={{ 
              top: `${navbarHeight}px`, 
              backgroundColor: '#FAFAF5',
              willChange: 'transform',
              pointerEvents: 'auto'
            }}
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
                        href="/services"
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
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 mt-2 w-full hover:scale-105 min-h-[44px]"
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