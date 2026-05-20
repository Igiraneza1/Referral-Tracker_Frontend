import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReferralList from './pages/ReferralList';
import ReferralDetail from './pages/ReferralDetail';
import NewReferral from './pages/NewReferral';
import ProtectedRoute from './context/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* protected — all roles */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/referrals"
            element={
              <ProtectedRoute>
                <ReferralList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/referrals/:id"
            element={
              <ProtectedRoute>
                <ReferralDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/referrals/new"
            element={
              <ProtectedRoute
                allowedRoles={[
                  'ADMIN',
                  'DEVELOPER',
                  'FACILITY_ADMIN',
                  'REFERRAL_OFFICER',
                ]}
              >
                <NewReferral />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}