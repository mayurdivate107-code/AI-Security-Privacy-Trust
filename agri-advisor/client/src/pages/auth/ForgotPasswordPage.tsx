import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { FormInput } from '../../components/forms/FormInput.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-agri-primary rounded-2xl mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Password Recovery</h2>
          <p className="text-xs text-slate-500">
            Enter your email to receive a secure password reset link
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {sent ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-3 text-center">
            <Mail className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">Recovery Link Sent!</h4>
            <p>
              Please check your inbox at <strong>{email}</strong> for instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="inline-block mt-3 px-4 py-2 bg-agri-primary text-white rounded-xl font-bold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Registered Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover disabled:bg-slate-300 rounded-xl shadow-sm transition"
            >
              {loading ? 'Sending Instructions...' : 'Send Recovery Email'}
            </button>
          </form>
        )}

        <div className="text-center text-xs">
          <Link
            to="/login"
            className="inline-flex items-center text-slate-500 hover:text-agri-primary font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
