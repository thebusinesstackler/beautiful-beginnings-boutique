
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <div className="text-charcoal font-medium">Loading admin panel...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-full mb-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Beautiful Beginnings
            </h1>
            <h2 className="text-xl font-medium text-chocolate mb-3">
              Admin Dashboard
            </h2>
            <p className="text-stone max-w-2xl mx-auto leading-relaxed">
              Manage your handcrafted keepsake business with our comprehensive dashboard. 
              Monitor orders, update inventory, and grow your beautiful brand.
            </p>
          </div>

          <AdminTabs />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
