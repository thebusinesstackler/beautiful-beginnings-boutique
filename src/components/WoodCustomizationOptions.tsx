
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TreePine, Ruler, Type, Calendar } from 'lucide-react';

interface WoodCustomizationOptionsProps {
  personalizationOptions?: any;
  onCustomizationChange?: (customizations: any) => void;
}

const WoodCustomizationOptions = ({ 
  personalizationOptions, 
  onCustomizationChange 
}: WoodCustomizationOptionsProps) => {
  const [selectedWoodType, setSelectedWoodType] = useState('Pine');
  const [selectedSize, setSelectedSize] = useState('8x10');
  const [customText, setCustomText] = useState('');
  const [specialDate, setSpecialDate] = useState('');

  const handleCustomizationUpdate = (updates: any) => {
    const customizations = {
      woodType: selectedWoodType,
      size: selectedSize,
      customText,
      specialDate,
      ...updates
    };
    
    if (onCustomizationChange) {
      onCustomizationChange(customizations);
    }
  };

  const handleWoodTypeChange = (woodType: string) => {
    setSelectedWoodType(woodType);
    handleCustomizationUpdate({ woodType });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    handleCustomizationUpdate({ size });
  };

  const handleTextChange = (text: string) => {
    setCustomText(text);
    handleCustomizationUpdate({ customText: text });
  };

  const handleDateChange = (date: string) => {
    setSpecialDate(date);
    handleCustomizationUpdate({ specialDate: date });
  };

  if (!personalizationOptions) return null;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
      <div className="flex items-center space-x-2">
        <TreePine className="h-5 w-5 text-amber-700" />
        <h3 className="text-lg font-semibold text-amber-900">Wood Customization Options</h3>
      </div>

      {/* Wood Type Selection */}
      {personalizationOptions.wood_type_options && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TreePine className="h-4 w-4 text-amber-600" />
            <label className="text-sm font-medium text-amber-800">Wood Type</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {personalizationOptions.wood_type_options.map((wood: string) => (
              <Badge
                key={wood}
                variant={selectedWoodType === wood ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedWoodType === wood 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                }`}
                onClick={() => handleWoodTypeChange(wood)}
              >
                {wood}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="border-amber-200" />

      {/* Size Selection */}
      {personalizationOptions.size_options && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Ruler className="h-4 w-4 text-amber-600" />
            <label className="text-sm font-medium text-amber-800">Size</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {personalizationOptions.size_options.map((size: string) => (
              <Badge
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedSize === size 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}"
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="border-amber-200" />

      {/* Custom Text */}
      {personalizationOptions.text_customization && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-amber-600" />
            <label className="text-sm font-medium text-amber-800">Custom Text</label>
          </div>
          <Textarea
            placeholder="Add names, quotes, or special messages (optional)"
            value={customText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-200"
            rows={3}
          />
          <p className="text-xs text-amber-600">
            Perfect for names, dates, or meaningful quotes
          </p>
        </div>
      )}

      {/* Special Date */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-amber-600" />
          <label className="text-sm font-medium text-amber-800">Special Date</label>
        </div>
        <Input
          type="date"
          value={specialDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
        />
        <p className="text-xs text-amber-600">
          Add an anniversary, birthday, or memorial date
        </p>
      </div>

      <div className="bg-amber-100 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">Wood Sublimation Process</h4>
        <p className="text-sm text-amber-800 leading-relaxed">
          Your photo will be permanently bonded to the wood using our sublimation process, 
          creating vibrant colors that complement the natural wood grain. Processing takes 3-5 business days.
        </p>
      </div>
    </div>
  );
};

export default WoodCustomizationOptions;
