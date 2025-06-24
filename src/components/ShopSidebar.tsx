
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface ShopSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ShopSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  isOpen,
  onClose
}: ShopSidebarProps) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:shadow-none lg:bg-transparent
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="h-full overflow-y-auto p-6 lg:p-0">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold" style={{ color: '#5B4C37' }}>Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sort By */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#5B4C37' }}>Sort By</h3>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="mb-8" style={{ backgroundColor: '#F6DADA' }} />

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#5B4C37' }}>Categories</h3>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              onClick={() => onCategoryChange('all')}
              className="w-full justify-start text-left"
              style={selectedCategory === 'all' ? { backgroundColor: '#E28F84', color: 'white' } : { color: '#7A7047' }}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                onClick={() => onCategoryChange(category)}
                className="w-full justify-start text-left"
                style={selectedCategory === category ? { backgroundColor: '#E28F84', color: 'white' } : { color: '#7A7047' }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mb-8" style={{ backgroundColor: '#F6DADA' }} />

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#5B4C37' }}>Price Range</h3>
          <div className="px-3">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              max={200}
              min={0}
              step={5}
              className="mb-4"
            />
            <div className="flex justify-between text-sm" style={{ color: '#A89B84' }}>
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" style={{ backgroundColor: '#F6DADA' }} />

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full"
          style={{ borderColor: '#E28F84', color: '#7A7047' }}
        >
          Clear All Filters
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default ShopSidebar;
