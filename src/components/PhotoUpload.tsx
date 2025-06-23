
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onUpload?: (file: File) => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

const PhotoUpload = ({ 
  onUpload, 
  maxSizeMB = 20, 
  accept = "image/jpeg,image/png,image/jpg",
  className = ""
}: PhotoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = accept.split(',').map(type => type.trim());
    if (!validTypes.some(type => file.type === type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `Please upload an image smaller than ${maxSizeMB}MB.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Callback
    if (onUpload) {
      onUpload(file);
    }

    toast({
      title: "Photo uploaded successfully!",
      description: `${file.name} is ready for your order.`
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-stone-300 hover:border-primary hover:bg-primary/5 bg-cream/50'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-stone-600'}
            `}>
              <Upload className="h-8 w-8" />
            </div>
            
            <div>
              <h3 className="text-lg font-playfair font-semibold text-charcoal mb-2">
                Upload Your Photo
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <Button variant="outline" className="mb-2">
                Choose File
              </Button>
              <p className="text-xs text-stone-500">
                JPG, PNG up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-white rounded-xl border border-stone-300 p-4">
          <div className="flex items-start space-x-4">
            {/* Preview */}
            <div className="flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-stone-300"
                />
              ) : (
                <div className="w-20 h-20 bg-stone-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-stone-600" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-charcoal truncate">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <div className="mt-2 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={openFileDialog}
                  className="text-xs"
                >
                  Replace
                </Button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-1 hover:bg-stone-100 rounded-full transition-colors duration-200"
            >
              <X className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
