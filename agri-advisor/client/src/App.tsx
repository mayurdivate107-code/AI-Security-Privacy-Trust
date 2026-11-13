import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { PublicLayout } from './components/layout/PublicLayout.js';
import { DashboardLayout } from './components/layout/DashboardLayout.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';

// Public Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.js';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage.js';

// Protected Pages
import { DashboardPage } from './pages/dashboard/DashboardPage.js';
import { ProfilePage } from './pages/profile/ProfilePage.js';
import { FarmsPage } from './pages/farms/FarmsPage.js';
import { CreateFarmPage } from './pages/farms/CreateFarmPage.js';
import { FarmDetailsPage } from './pages/farms/FarmDetailsPage.js';
import { CropRecommendationPage } from './pages/crop/CropRecommendationPage.js';
import { DiseaseDetectionPage } from './pages/disease/DiseaseDetectionPage.js';
import { FertilizerAdvisoryPage } from './pages/fertilizer/FertilizerAdvisoryPage.js';
import { IrrigationAdvisoryPage } from './pages/irrigation/IrrigationAdvisoryPage.js';
import { AdvisoriesListPage } from './pages/advisories/AdvisoriesListPage.js';
import { AdvisoryDetailsPage } from './pages/advisories/AdvisoryDetailsPage.js';
import { KnowledgeCenterPage } from './pages/knowledge/KnowledgeCenterPage.js';
import { KnowledgeArticlePage } from './pages/knowledge/KnowledgeArticlePage.js';
import { NotificationsPage } from './pages/notifications/NotificationsPage.js';
import { SettingsPage } from './pages/settings/SettingsPage.js';

export const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/farms/new" element={<CreateFarmPage />} />
            <Route path="/farms/:id" element={<FarmDetailsPage />} />
            <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/fertilizer-advisory" element={<FertilizerAdvisoryPage />} />
            <Route path="/irrigation-advisory" element={<IrrigationAdvisoryPage />} />
            <Route path="/advisories" element={<AdvisoriesListPage />} />
            <Route path="/advisories/:id" element={<AdvisoryDetailsPage />} />
            <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
            <Route path="/knowledge-center/:slug" element={<KnowledgeArticlePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
