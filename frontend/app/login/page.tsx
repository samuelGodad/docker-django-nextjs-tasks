'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setTokens, setUser, clearTokens } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear any old tokens when the login page loads (in case of logout errors)
  useEffect(() => {
    clearTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, tokens } = await authAPI.login(formData);
      setTokens(tokens.access, tokens.refresh);
      setUser(user);
      router.push('/dashboard');
      router.refresh(); // Force refresh to update nav
    } catch (err: any) {
      console.error('Login error:', err);
      // Handle different error formats
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered input-lg w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered input-lg w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="divider my-6">OR</div>

          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Don't have an account?{' '}
              <Link href="/register" className="link link-primary font-semibold">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

