
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerateContentParams {
  productName: string;
  category: string;
  contentType: 'description' | 'seo_title' | 'seo_description';
  existingDescription?: string;
}

export const useAIContentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (params: GenerateContentParams): Promise<string | null> => {
    if (!params.productName.trim()) {
      toast({
        title: "Error",
        description: "Product name is required to generate content",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating AI content:', params);
      
      const { data, error } = await supabase.functions.invoke('generate-product-content', {
        body: params,
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.content) {
        throw new Error('No content generated');
      }

      toast({
        title: "Content Generated",
        description: `AI-generated ${params.contentType.replace('_', ' ')} is ready!`,
      });

      return data.content;
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating,
  };
};
