import React from 'react';
import { useApp } from '../../context/AppContext';
import { LoginPage } from '../../pages/LoginPage';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, currentView } = useApp();

  if (!isAuthenticated && currentView !== 'landing') {
    return <LoginPage />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 text-rose-700 m-8">
        <h3 className="font-bold text-lg">403 - Forbidden Access</h3>
        <p className="text-xs mt-1">Your role ({user.role}) does not have authorization to view this ERP section.</p>
      </div>
    );
  }

  return children;
};
