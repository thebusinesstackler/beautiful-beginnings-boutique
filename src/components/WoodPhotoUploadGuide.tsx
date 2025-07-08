
import { Upload, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WoodPhotoUploadGuide = () => {
  const requirements = [
    { icon: CheckCircle, text: "High resolution (1000x1000px minimum)", type: "good" },
    { icon: CheckCircle, text: "JPG or PNG format", type: "good" },
    { icon: CheckCircle, text: "Good lighting and clear focus", type: "good" },
    { icon: CheckCircle, text: "File size under 20MB", type: "good" },
  ];

  const tips = [
    "Photos with high contrast work best on wood",
    "Natural wood grain will show through lighter areas", 
    "Darker photos create more dramatic effects",
    "Portrait orientation works well for most wood pieces"
  ];

  return (
    <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-xl p-6 border border-stone-200">
      <div className="flex items-center space-x-2 mb-4">
        <Image className="h-5 w-5 text-amber-700" />
        <h3 className="text-lg font-semibold text-stone-800">Photo Requirements for Wood Sublimation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-stone-700 mb-3 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Requirements
          </h4>
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <req.icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-stone-700">{req.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-stone-700 mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Pro Tips
          </h4>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-stone-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-100 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-amber-800">Wood Grain Effect</h5>
            <p className="text-sm text-amber-700 mt-1">
              The natural wood grain will be visible through your photo, creating a unique rustic effect. 
              This is part of the charm of wood sublimation and makes each piece one-of-a-kind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoodPhotoUploadGuide;
