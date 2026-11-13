import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-agri-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-agri-primary text-white rounded-lg">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-agri-text">
            Agri<span className="text-agri-primary">Advisor</span>
          </span>
        </Link>
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <Link
            to="/login"
            className="px-4 py-2 text-slate-700 hover:text-agri-primary transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-white bg-agri-primary hover:bg-agri-primary-hover rounded-xl shadow-sm transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-agri-muted">
        <p>© 2026 AgriAdvisor AI Platform. Advancing Sustainable Precision Agriculture.</p>
      </footer>
    </div>
  );
};
