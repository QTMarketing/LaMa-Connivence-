'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { getProductsByCategory } from '@/lib/productData';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(72);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  
  // Get services for mobile menu dropdown
  const services = getProductsByCategory('services');
  

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
        <div className="relative w-full flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
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
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-6 xl:gap-8 select-none">
            <Link
              href="/deals"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-bold tracking-[0.01em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
            >
              Deals
            </Link>
            <Link
              href="/drinks"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-bold tracking-[0.01em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
            >
              Drinks
            </Link>

            <Link
              href="/services"
              className={`nav-link-premium relative text-[22px] xl:text-[24px] font-bold tracking-[0.01em] ${
                pathname === '/services' ? 'text-primary' : 'text-[#1A1A1A]'
              } transition-colors duration-300`}
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
            >
              Services
            </Link>

            <Link
              href="/rewards"
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-bold tracking-[0.01em] text-[#1A1A1A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
            >
              Rewards
            </Link>
            <span 
              className="nav-link-premium relative text-[22px] xl:text-[24px] font-bold tracking-[0.01em] text-[#1A1A1A] cursor-default"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
            >
              Delivery
            </span>
          </nav>

          {/* Right: Find a Store + mobile menu */}
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 btn-primary text-white"
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
              <div className="px-6 py-8 flex flex-col gap-4">
                {[
                  { href: '/deals', label: 'Deals' },
                  { href: '/drinks', label: 'Drinks' },
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
                      className="nav-link-premium-mobile relative text-[16px] font-bold tracking-[0.01em] text-[#1A1A1A] py-4 block transition-colors duration-300"
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
                  <span className="nav-link-premium-mobile relative text-[16px] font-bold tracking-[0.01em] text-[#1A1A1A] py-4 block cursor-default">
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
                    className="nav-link-premium-mobile relative text-[16px] font-bold tracking-[0.01em] text-[#1A1A1A] py-4 block transition-colors duration-300"
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