import React, { createContext, useContext, useEffect, useState } from 'react';
import { Farm } from '../types/index.js';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.js';

interface FarmContextType {
  farms: Farm[];
  selectedFarm: Farm | null;
  setSelectedFarm: (farm: Farm | null) => void;
  loading: boolean;
  refreshFarms: () => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshFarms = async () => {
    if (!user) {
      setFarms([]);
      setSelectedFarm(null);
      return;
    }
    try {
      setLoading(true);
      const res: any = await api.get('/farms');
      const farmList: Farm[] = res.data || [];
      setFarms(farmList);
      if (farmList.length > 0 && !selectedFarm) {
        setSelectedFarm(farmList[0]);
      }
    } catch (err) {
      console.error('Failed to load farms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFarms();
  }, [user]);

  return (
    <FarmContext.Provider
      value={{
        farms,
        selectedFarm,
        setSelectedFarm,
        loading,
        refreshFarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarmContext = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within a FarmProvider');
  }
  return context;
};
