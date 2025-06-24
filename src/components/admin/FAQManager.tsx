
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, GripVertical } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewFAQ = () => {
    const newFAQ: FAQ = {
      id: `temp-${Date.now()}`,
      question: '',
      answer: '',
      sort_order: faqs.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFaqs([...faqs, newFAQ]);
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: string | boolean) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, [field]: value, updated_at: new Date().toISOString() }
        : faq
    ));
  };

  const deleteFAQ = async (id: string) => {
    if (id.startsWith('temp-')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFaqs(faqs.filter(faq => faq.id !== id));
      
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const saveFAQs = async () => {
    setSaving(true);
    try {
      // Separate new FAQs from existing ones
      const newFAQs = faqs.filter(faq => faq.id.startsWith('temp-'));
      const existingFAQs = faqs.filter(faq => !faq.id.startsWith('temp-'));

      // Insert new FAQs
      if (newFAQs.length > 0) {
        const { error: insertError } = await supabase
          .from('faqs')
          .insert(newFAQs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            sort_order: faq.sort_order,
            is_active: faq.is_active
          })));

        if (insertError) throw insertError;
      }

      // Update existing FAQs
      for (const faq of existingFAQs) {
        const { error: updateError } = await supabase
          .from('faqs')
          .update({
            question: faq.question,
            answer: faq.answer,
            sort_order: faq.sort_order,
            is_active: faq.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', faq.id);

        if (updateError) throw updateError;
      }

      // Refresh the list
      await fetchFAQs();

      toast({
        title: "Success",
        description: "FAQs updated successfully",
      });
    } catch (error) {
      console.error('Error saving FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to save FAQs",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
        <div className="text-charcoal font-medium">Loading FAQs...</div>
      </div>
    );
  }

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-charcoal">Frequently Asked Questions</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={addNewFAQ}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
            <Button
              onClick={saveFAQs}
              disabled={saving}
              className="bg-sage hover:bg-sage/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="p-4 border rounded-lg bg-white/50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-base font-medium text-charcoal">Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                    placeholder="Enter the question"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-charcoal">Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                    placeholder="Enter the answer"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`active-${faq.id}`}
                      checked={faq.is_active}
                      onChange={(e) => updateFAQ(faq.id, 'is_active', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`active-${faq.id}`} className="text-sm text-stone">
                      Active
                    </Label>
                  </div>
                  
                  <Button
                    onClick={() => deleteFAQ(faq.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-8 text-stone">
            <p>No FAQs found. Add your first FAQ to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FAQManager;
