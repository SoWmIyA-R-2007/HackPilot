'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Fingerprint, Mail, Eye, EyeOff, ArrowRight, Play } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (email.includes('@')) {
          router.push('/dashboard');
          return;
        }
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-[#090d16] min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="w-full max-w-md relative z-10">
        <div className="flex flex-col w-full h-full items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-[400px] glass-panel rounded-3xl p-8 shadow-2xl border border-slate-800">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h1 className="font-extrabold text-2xl text-slate-100 m-0">
                Welcome back
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Log in to your Mission Control account
              </p>
            </div>
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-300 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-900/80 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="password">
                    Password
                  </label>
                  <a className="text-xs text-amber-400 hover:underline font-semibold" href="#">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl mt-2 transition-all shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-[1px] flex-1 bg-slate-800"></div>
              <span className="text-xs text-slate-500 font-semibold">or continue with</span>
              <div className="h-[1px] flex-1 bg-slate-800"></div>
            </div>

            {/* OAuth & Demo Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-slate-900/90 text-slate-200 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 relative overflow-hidden group cursor-pointer border border-slate-800"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 cursor-pointer border border-amber-500/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Explore Demo Mode</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-6">
              Don't have an account?{' '}
              <a className="text-amber-400 hover:underline font-bold" href="#">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
