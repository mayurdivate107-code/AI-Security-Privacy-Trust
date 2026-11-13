import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Bell, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const Navbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, profile, signOut } = useAuth();
  const { farms, selectedFarm, setSelectedFarm } = useFarmContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      <div className="flex items-center space-x-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 text-slate-500 rounded-lg lg:hidden hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-9 h-9 bg-agri-primary text-white rounded-xl shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-agri-text">
            Agri<span className="text-agri-primary">Advisor</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Farm Context Switcher */}
        {farms.length > 0 && (
          <div className="hidden sm:flex items-center">
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const found = farms.find((f) => f.id === e.target.value);
                setSelectedFarm(found || null);
              }}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-agri-primary cursor-pointer"
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  🌱 {farm.farm_name} ({farm.area} {farm.area_unit})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2 text-slate-500 hover:text-agri-primary hover:bg-slate-50 rounded-xl transition"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'F'}
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
              {profile?.full_name || 'Farmer'}
            </span>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs font-medium"
              onClick={() => setProfileOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900 truncate">{profile?.full_name || 'Farmer'}</p>
                <p className="text-slate-500 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
                Profile Details
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
