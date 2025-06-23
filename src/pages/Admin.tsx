
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminTabs from '@/components/admin/AdminTabs';

const Admin = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!profile || !profile.is_admin)) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-800">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center text-gray-800">
              🛠️ Beautiful Beginnings Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive management dashboard for your handcrafted business</p>
          </div>

          <AdminTabs />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
