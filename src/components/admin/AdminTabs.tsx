import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Tags, Star, FileText, Users, BarChart3, Settings, Megaphone, Layers } from 'lucide-react';
import ProductManagement from './ProductManagement';
import InventoryManagement from './InventoryManagement';
import CategoryManager from './CategoryManager';
import FeaturedManager from './FeaturedManager';
import BlogManager from './BlogManager';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import DashboardOverview from './DashboardOverview';
import AdminSettings from './AdminSettings';
import MarketingTools from './MarketingTools';

const AdminTabs = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList 
          className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1"
          style={{ backgroundColor: '#FAF5EF', border: '1px solid #E5D5C8' }}
        >
          <TabsTrigger 
            value="dashboard" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <BarChart3 className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Package className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Products</span>
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Layers className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Inventory</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Tags className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Categories</span>
          </TabsTrigger>
          <TabsTrigger 
            value="featured" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Star className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Featured</span>
          </TabsTrigger>
          <TabsTrigger 
            value="blog" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <FileText className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Blog</span>
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <ShoppingCart className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Users className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Customers</span>
          </TabsTrigger>
          <TabsTrigger 
            value="marketing" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Megaphone className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Marketing</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex flex-col items-center p-2 text-xs data-[state=active]:shadow-sm"
            style={{ 
              color: '#5B4C37',
              backgroundColor: 'transparent'
            }}
            data-active-style={{ backgroundColor: '#A9B28F', color: 'white' }}
          >
            <Settings className="h-4 w-4 mb-1" />
            <span className="hidden sm:block">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
          <TabsContent value="featured">
            <FeaturedManager />
          </TabsContent>
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>
          <TabsContent value="marketing">
            <MarketingTools />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </div>
      </Tabs>

      <style jsx>{`
        [data-state="active"] {
          background-color: #A9B28F !important;
          color: white !important;
        }
        [data-state="active"] svg {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default AdminTabs;
