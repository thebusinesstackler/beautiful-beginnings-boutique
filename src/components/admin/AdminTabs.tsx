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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <TabsList 
            className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1 bg-gradient-to-r from-cream to-stone-50"
          >
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200 
                         text-charcoal hover:text-chocolate hover:bg-white/70 
                         data-[state=active]:bg-sage data-[state=active]:text-white 
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <BarChart3 className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Dashboard</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="products" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Package className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Products</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="inventory" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Layers className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Inventory</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="categories" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Tags className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Categories</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="featured" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Star className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Featured</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="blog" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <FileText className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Blog</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="orders" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <ShoppingCart className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Orders</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="customers" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Users className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Customers</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="marketing" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Megaphone className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Marketing</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center p-3 text-xs font-medium transition-all duration-200
                         text-charcoal hover:text-chocolate hover:bg-white/70
                         data-[state=active]:bg-sage data-[state=active]:text-white
                         data-[state=active]:shadow-sm rounded-md mx-1
                         outline-none border-none focus:outline-none focus-visible:outline-none 
                         focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none
                         focus:shadow-none focus-visible:shadow-none"
            >
              <Settings className="h-4 w-4 mb-1" />
              <span className="hidden sm:block">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-gradient-to-br from-cream/30 to-blush/20 rounded-lg p-6 shadow-sm">
          <TabsContent value="dashboard" className="mt-0">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="products" className="mt-0">
            <ProductManagement />
          </TabsContent>
          <TabsContent value="inventory" className="mt-0">
            <InventoryManagement />
          </TabsContent>
          <TabsContent value="categories" className="mt-0">
            <CategoryManager />
          </TabsContent>
          <TabsContent value="featured" className="mt-0">
            <FeaturedManager />
          </TabsContent>
          <TabsContent value="blog" className="mt-0">
            <BlogManager />
          </TabsContent>
          <TabsContent value="orders" className="mt-0">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="customers" className="mt-0">
            <CustomerManagement />
          </TabsContent>
          <TabsContent value="marketing" className="mt-0">
            <MarketingTools />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <AdminSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminTabs;
