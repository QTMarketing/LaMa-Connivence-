'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let active = true;
    // The HttpOnly cookie is the only authority, so ask the server.
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.signedIn) router.replace(nextPath);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'Unable to sign in. Please try again.',
        );
        setIsLoading(false);
        return;
      }

      router.replace(nextPath);
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Unable to login right now. Please try again shortly.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-md bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="text-primary" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-black text-secondary">
              Admin Login
            </h1>
            <p className="text-gray-600">Sign in with your LaMa admin account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            aria-label="Admin login form"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 transition-colors focus:border-primary focus:outline-none"
                placeholder="you@quicktrackinc.com"
                autoComplete="username"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 transition-colors focus:border-primary focus:outline-none"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
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
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={20} />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Lost access? Ask the site owner to reset your account.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
          <div className="w-full max-w-md rounded-md bg-white p-8 text-center text-gray-500 shadow-2xl">
            Loading…
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
