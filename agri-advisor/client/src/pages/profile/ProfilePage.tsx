import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { api } from '../../lib/api.js';

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [state, setState] = useState(profile?.state || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg(null);
      await api.patch('/auth/profile', {
        full_name: fullName,
        phone,
        state,
        district,
      });
      await refreshProfile();
      setMsg('Profile updated successfully!');
    } catch (err: any) {
      setMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Farmer Profile Details</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal and contact credentials</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{profile?.full_name || 'Farmer Partner'}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            {msg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <FormInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="State / Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <FormInput
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3 px-4 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover disabled:bg-slate-300 rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
};
