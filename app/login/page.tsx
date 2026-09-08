'use client';

import { createClient } from '@/lib/supabase/client';
import { Rocket, Play, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Block */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-14 h-14 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#1a1a1a] shadow-brutal">
            <Rocket className="w-8 h-8 text-[#ffcc00]" />
          </div>
          <span className="text-4xl font-headline font-bold tracking-tighter uppercase text-[#1a1a1a]">
            Mission Control
          </span>
        </div>

        {/* Login Card */}
        <div className="border-4 border-[#1a1a1a] bg-[#eee9e0] shadow-brutal-xl p-10">
          <h1 className="font-headline font-bold text-3xl uppercase mb-2 text-[#1a1a1a]">
            Access Terminal
          </h1>
          <p className="font-body text-[#4a4a4a] mb-8">
            Authenticate with your Google account or explore in live demo mode.
          </p>

          {/* Decorative Line */}
          <div className="h-1 bg-[#1a1a1a] mb-8" />

          {/* Google Login Button */}
          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            className="w-full bg-[#ffcc00] border-4 border-[#1a1a1a] py-4 px-6 font-label font-bold uppercase tracking-wider text-lg flex items-center justify-center gap-3 hover:bg-[#1a1a1a] hover:text-[#f5f0e8] transition-all shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6 gap-3">
            <div className="h-[2px] bg-[#1a1a1a] flex-1" />
            <span className="font-mono text-xs font-bold text-[#6a6a6a] uppercase">OR</span>
            <div className="h-[2px] bg-[#1a1a1a] flex-1" />
          </div>

          {/* Demo Login Button */}
          <button
            id="btn-demo-login"
            onClick={handleDemoLogin}
            className="w-full bg-[#1a1a1a] text-[#f5f0e8] border-4 border-[#1a1a1a] py-3.5 px-6 font-label font-bold uppercase tracking-wider text-base flex items-center justify-center gap-3 hover:bg-[#ffcc00] hover:text-[#1a1a1a] transition-all shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer group"
          >
            <Play className="w-5 h-5 text-[#ffcc00] group-hover:text-[#1a1a1a] fill-current" />
            <span>Continue in Demo Mode</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer */}
          <p className="font-mono text-xs text-[#4a4a4a] text-center mt-6">
            v2.0.0 — HACKATHON AUTOMATION TRACKER
          </p>
        </div>

        {/* Decorative bottom strip */}
        <div className="mt-4 h-2 bg-[#ffcc00] border-2 border-[#1a1a1a]" />
      </div>
    </div>
  );
}
