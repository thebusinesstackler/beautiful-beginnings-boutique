
import React, { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  children: React.ReactNode;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = MAX_FILE_SIZE,
  children
}) => {
  const { toast } = useToast();

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPEG, PNG, and WebP images are allowed",
        variant: "destructive",
      });
      return false;
    }

    // Check file extension matches MIME type
    const extension = file.name.toLowerCase().split('.').pop();
    const expectedExtensions: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp']
    };

    const validExtensions = expectedExtensions[file.type] || [];
    if (!extension || !validExtensions.includes(extension)) {
      toast({
        title: "File Extension Mismatch",
        description: "File extension does not match the file type",
        variant: "destructive",
      });
      return false;
    }

    // Additional security checks
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      toast({
        title: "Invalid File Name",
        description: "File name contains invalid characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [maxSize, toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (validateFile(file)) {
      onFileSelect(file);
    }

    // Clear input to allow same file to be selected again
    event.target.value = '';
  }, [onFileSelect, validateFile]);

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Secure Upload:</strong> Files are validated for type, size, and security before processing.
          Only JPEG, PNG, and WebP images up to {Math.round(maxSize / 1024 / 1024)}MB are accepted.
        </AlertDescription>
      </Alert>
      
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="secure-file-input"
      />
      
      <label htmlFor="secure-file-input" style={{ cursor: 'pointer', display: 'block' }}>
        {children}
      </label>
    </div>
  );
};
