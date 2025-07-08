
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CompactPhotoUploadProps {
  onUpload?: (file: File) => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

const CompactPhotoUpload = ({ 
  onUpload, 
  maxSizeMB = 20, 
  accept = "image/jpeg,image/png,image/jpg",
  className = ""
}: CompactPhotoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = accept.split(',').map(type => type.trim());
    if (!validTypes.some(type => file.type === type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive"
      });
      return;
    }

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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (onUpload) {
      onUpload(file);
    }

    toast({
      title: "Photo uploaded!",
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
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-sage bg-sage/5 scale-105' 
              : 'border-stone-300 hover:border-sage hover:bg-sage/5 bg-cream/50'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-full transition-colors duration-200
              ${isDragging ? 'bg-sage text-white' : 'bg-stone-200 text-stone-600'}
            `}>
              <Upload className="h-4 w-4" />
            </div>
            
            <div className="flex-1 text-left">
              <h4 className="text-sm font-medium text-charcoal">
                Upload Photo
              </h4>
              <p className="text-xs text-stone-600">
                Drag & drop or click to browse (JPG, PNG up to {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-white rounded-lg border border-stone-300 p-3">
          <div className="flex items-center space-x-3">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-stone-300"
              />
            ) : (
              <div className="w-12 h-12 bg-stone-200 rounded flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-stone-600" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-charcoal truncate">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-stone-600">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={openFileDialog}
                className="text-xs h-7 px-2"
              >
                Replace
              </Button>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-stone-100 rounded transition-colors duration-200"
              >
                <X className="h-4 w-4 text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactPhotoUpload;
