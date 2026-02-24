'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If we already have a successful admin session (set server-side),
    // skip the login screen.
    const authStatus = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (authStatus) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'Incorrect password or too many attempts. Please try again.',
        );
        setIsLoading(false);
        return;
      }

      // Mark client-side auth flag; the real authority is the HttpOnly cookie
      // that the login API sets.
      sessionStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin');
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Unable to login right now. Please try again shortly.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-md shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lock className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-black text-secondary mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Enter your password to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Admin login form">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-gray-900"
                  placeholder="Enter password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              For security, the admin password is now managed via environment variables.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
