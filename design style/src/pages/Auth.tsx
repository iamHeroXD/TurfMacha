import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  Apple,
  Eye,
  EyeOff } from
'lucide-react';
export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual only — pretend login succeeded
    navigate('/turfs');
  };
  return (
    <div className="pt-24 pb-12 min-h-screen flex items-stretch">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Visual Panel (desktop only) */}
        <div className="hidden lg:block relative h-[640px] rounded-[2.5rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1200"
            alt="Football turf"
            className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-turf-emerald/90 via-turf-emerald/70 to-turf-emerald/30"></div>

          <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-10 h-10 bg-turf-lime rounded-xl flex items-center justify-center transform -rotate-6">
                <MapPin className="w-6 h-6 text-turf-emerald" />
              </div>
              <span className="font-display font-bold text-2xl">TurfMacha</span>
            </Link>

            <div>
              <h2 className="font-display font-bold text-4xl mb-4 leading-tight">
                Welcome back,
                <br />
                macha 👋
              </h2>
              <p className="text-turf-cream/80 text-lg mb-8 max-w-sm">
                Your next game is one tap away. Book the best turfs in
                Trivandrum instantly.
              </p>

              <div className="flex gap-2 items-center text-sm text-turf-cream/70">
                <div className="flex -space-x-2">
                  {[11, 12, 13, 14].map((i) =>
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-turf-emerald" />

                  )}
                </div>
                <span>Joined by 10,000+ players in TVM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-turf-emerald rounded-xl flex items-center justify-center transform -rotate-6">
                <MapPin className="w-6 h-6 text-turf-lime" />
              </div>
              <span className="font-display font-bold text-2xl text-turf-emerald">
                TurfMacha
              </span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-turf-emerald/10 rounded-2xl p-1.5 flex mb-8 shadow-sm">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${mode === 'login' ? 'bg-turf-emerald text-white shadow-md' : 'text-turf-charcoal/70 hover:text-turf-emerald'}`}>
              
              Log in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${mode === 'signup' ? 'bg-turf-emerald text-white shadow-md' : 'text-turf-charcoal/70 hover:text-turf-emerald'}`}>
              
              Sign up
            </button>
          </div>

          <h1 className="font-display font-bold text-3xl text-turf-emerald mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-turf-charcoal/60 mb-8">
            {mode === 'login' ?
            'Log in to book your next match.' :
            'Start booking turfs in 60 seconds.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' &&
            <div>
                <label className="block text-sm font-medium text-turf-charcoal mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                  type="text"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-turf-lime focus:border-transparent transition-shadow"
                  placeholder="Arjun Sreekumar" />
                
                </div>
              </div>
            }

            <div>
              <label className="block text-sm font-medium text-turf-charcoal mb-1.5">
                Phone number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-turf-lime focus:border-transparent transition-shadow"
                  placeholder="+91 98765 43210" />
                
              </div>
            </div>

            {mode === 'signup' &&
            <div>
                <label className="block text-sm font-medium text-turf-charcoal mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                  type="email"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-turf-lime focus:border-transparent transition-shadow"
                  placeholder="arjun@example.com" />
                
                </div>
              </div>
            }

            <div>
              <label className="block text-sm font-medium text-turf-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-turf-lime focus:border-transparent transition-shadow"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-turf-emerald">
                  
                  {showPassword ?
                  <EyeOff className="w-5 h-5" /> :

                  <Eye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {mode === 'signup' &&
            <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded accent-turf-emerald" />
              
                <span className="text-sm text-turf-charcoal/70">
                  I agree to TurfMacha's{' '}
                  <Link
                  to="/legal"
                  className="text-turf-emerald font-medium hover:underline">
                  
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link
                  to="/legal"
                  className="text-turf-emerald font-medium hover:underline">
                  
                    Privacy Policy
                  </Link>
                </span>
              </label>
            }

            {mode === 'login' &&
            <div className="flex justify-end">
                <a
                href="#"
                className="text-sm text-turf-emerald font-medium hover:underline">
                
                  Forgot password?
                </a>
              </div>
            }

            <button
              type="submit"
              className="w-full bg-turf-emerald text-white py-4 rounded-xl font-bold text-base hover:bg-turf-emerald/90 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-turf-emerald/20 flex items-center justify-center gap-2 mt-2">
              
              {mode === 'login' ? 'Log in' : 'Create account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 font-medium text-sm hover:border-turf-emerald hover:bg-turf-cream/30 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 font-medium text-sm hover:border-turf-emerald hover:bg-turf-cream/30 transition-colors">
              <Apple className="w-5 h-5 fill-current" /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>);

}