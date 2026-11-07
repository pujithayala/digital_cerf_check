import React from 'react';
import { ShieldCheck, Search, Lock, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ activePage, setActivePage }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={() => setActivePage('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Certi<span className="text-indigo-600">Verify</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                Cloud Authority
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Digital Certificate Authentication & Verification System
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setActivePage('home')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activePage === 'home'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Verification Portal</span>
          </button>

          <button
            onClick={() => setActivePage('admin')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activePage === 'admin'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Admin Console</span>
            {isAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" title="Logged in" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

