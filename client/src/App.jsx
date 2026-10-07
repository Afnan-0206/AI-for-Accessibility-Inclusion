import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { A11yProvider } from './a11y/A11yProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import History from './pages/History';
import NotFound from './pages/NotFound';
import ConstellationDemo from './pages/ConstellationDemo';
import ArchitecturePage from './pages/ArchitecturePage';

export default function App() {
  return (
    <A11yProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 high-contrast:bg-black text-slate-900 dark:text-slate-100 high-contrast:text-yellow-400 font-sans antialiased transition-colors">
          <Header />
          <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/constellation-demo" element={<ConstellationDemo />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute>
                    <Result />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </A11yProvider>
  );
}
