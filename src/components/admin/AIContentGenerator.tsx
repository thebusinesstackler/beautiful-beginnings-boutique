
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAIContentGenerator } from '@/hooks/useAIContentGenerator';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIContentGeneratorProps {
  productName: string;
  category: string;
  contentType: 'description' | 'seo_title' | 'seo_description';
  onContentGenerated: (content: string) => void;
  buttonText?: string;
  disabled?: boolean;
  size?: 'sm' | 'default';
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  productName,
  category,
  contentType,
  onContentGenerated,
  buttonText,
  disabled = false,
  size = 'sm'
}) => {
  const { generateContent, isGenerating } = useAIContentGenerator();

  const handleGenerate = async () => {
    const content = await generateContent({
      productName,
      category,
      contentType,
    });

    if (content) {
      onContentGenerated(content);
    }
  };

  const getDefaultButtonText = () => {
    switch (contentType) {
      case 'description':
        return 'Generate Description';
      case 'seo_title':
        return 'Generate SEO Title';
      case 'seo_description':
        return 'Generate SEO Description';
      default:
        return 'Generate';
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleGenerate}
      disabled={disabled || isGenerating || !productName.trim()}
      className="bg-sage/10 border-sage text-sage hover:bg-sage hover:text-white transition-colors"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          {buttonText || getDefaultButtonText()}
        </>
      )}
    </Button>
  );
};

export default AIContentGenerator;
