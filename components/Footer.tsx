'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/franchise', label: 'Franchise' },
    { href: '/stores', label: 'Find a Store' },
  ];

  const supportLinks = [
    { href: '/contact', label: 'Contact' },
    { href: '/vendors', label: 'Vendors' },
    { href: '/stores', label: 'Store Request' },
    { href: '/accessibility', label: 'Accessibility' },
  ];

  const mediaLinks = [
    { href: '/media/blog', label: 'Blog' },
    { href: '/media', label: 'Press Room' },
  ];

  // TODO: Update with actual social media URLs before launch
  const socialLinks = [
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  ];

  return (
    <footer className="border-t border-gray-700 section" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="container-standard">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-block mb-4 group">
              <span className="text-3xl font-black text-white transition-colors duration-300">
                <span className="text-primary group-hover:opacity-80 transition-opacity duration-300" style={{ color: '#FF6B35' }}>LA</span>MA
              </span>
            </Link>
            <p className="typography-body-sm text-white/80 mb-6">
              Your neighborhood convenience store. Fresh food, cold drinks, and everything you need, right around the corner.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="typography-body-sm font-bold text-white uppercase tracking-wide mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="typography-body-sm text-white/80 hover:text-primary transition-colors duration-300 inline-block group"
                  >
                    {link.label}
                    <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <Link
                  href="/deals"
                  className="text-sm text-white/80 hover:text-primary transition-colors duration-300 inline-block group"
                >
                  Deals
                  <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Link
                  href="/rewards"
                  className="text-sm text-white/80 hover:text-primary transition-colors duration-300 inline-block group"
                >
                  Rewards
                  <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Support Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="typography-body-sm font-bold text-white uppercase tracking-wide mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="typography-body-sm text-white/80 hover:text-primary transition-colors duration-300 inline-block group"
                  >
                    {link.label}
                    <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Media Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h3 className="typography-body-sm font-bold text-white uppercase tracking-wide mb-4">
              Media
            </h3>
            <ul className="space-y-3">
              {mediaLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="typography-body-sm text-white/80 hover:text-primary transition-colors duration-300 inline-block group"
                  >
                    {link.label}
                    <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Subscription Column - Last in Row - NO LOGO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="relative"
            style={{ backgroundImage: 'none' }}
          >
            {/* Explicitly no logo image here */}
            <h3 className="typography-body-sm font-bold text-white uppercase tracking-wide mb-4">
              Subscribe to Newsletter
            </h3>
            <p className="typography-body-sm text-white/80 mb-4">
              Stay updated with our latest deals, promotions, and store news.
            </p>
            <form 
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                // Newsletter subscription logic can be added here
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors duration-300 typography-body"
                required
              />
              <button
                type="submit"
                className="btn-primary w-full uppercase"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-gray-700 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="typography-body-sm text-white/60">
              © {currentYear} LaMa™. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { href: '/terms-of-service', label: 'Terms & Conditions' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/cookie-policy', label: 'Cookie Policy' },
                { href: '/california-privacy', label: 'California Privacy' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="typography-body-sm text-white/60 hover:text-primary transition-colors duration-300 inline-block group"
                  >
                    {link.label}
                    <span className="block w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
