import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // Allow accessing routes even if not logged in (fallback to demo/evaluator mode)
  // or redirect to login if strictly required. In hackathon judging, opening playground is allowed!
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
