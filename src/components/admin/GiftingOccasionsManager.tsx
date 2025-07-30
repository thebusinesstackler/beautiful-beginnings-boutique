
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSecurePhotoUpload } from '@/hooks/useSecurePhotoUpload';
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';

interface GiftingOccasion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  href: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: 'Heart', label: 'Heart' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'Star', label: 'Star' }
];

const GiftingOccasionsManager = () => {
  const [occasions, setOccasions] = useState<GiftingOccasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GiftingOccasion>>({});
  const { toast } = useToast();
  const { uploadPhoto, uploading } = useSecurePhotoUpload();

  useEffect(() => {
    fetchOccasions();
  }, []);

  const fetchOccasions = async () => {
    try {
      const { data, error } = await supabase
        .from('gifting_occasions')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setOccasions(data || []);
    } catch (error) {
      console.error('Error fetching gifting occasions:', error);
      toast({
        title: "Error",
        description: "Failed to load gifting occasions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (occasion: GiftingOccasion) => {
    setEditingId(occasion.id);
    setFormData(occasion);
  };

  const handleSave = async () => {
    if (!editingId || !formData.title || !formData.description || !formData.href) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('gifting_occasions')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          href: formData.href,
          icon_name: formData.icon_name,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gifting occasion updated successfully",
      });

      setEditingId(null);
      setFormData({});
      fetchOccasions();
    } catch (error) {
      console.error('Error updating gifting occasion:', error);
      toast({
        title: "Error",
        description: "Failed to update gifting occasion",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadPhoto(file, `gifting-occasion-${Date.now()}`);
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gifting occasion?')) return;

    try {
      const { error } = await supabase
        .from('gifting_occasions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gifting occasion deleted successfully",
      });

      fetchOccasions();
    } catch (error) {
      console.error('Error deleting gifting occasion:', error);
      toast({
        title: "Error",
        description: "Failed to delete gifting occasion",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
        <div className="text-charcoal font-medium">Loading gifting occasions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-charcoal">Gifting Occasions</h3>
      </div>

      <div className="grid gap-6">
        {occasions.map((occasion) => (
          <Card key={occasion.id} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              {editingId === occasion.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Title *
                      </label>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Link URL *
                      </label>
                      <Input
                        value={formData.href || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                        placeholder="/shop/category"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Icon
                      </label>
                      <Select
                        value={formData.icon_name || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Sort Order
                      </label>
                      <Input
                        type="number"
                        value={formData.sort_order || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-6">
                      <Switch
                        checked={formData.is_active || false}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <label className="text-sm font-medium text-charcoal">Active</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Image
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.image_url && (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id={`image-upload-${occasion.id}`}
                          disabled={uploading}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById(`image-upload-${occasion.id}`)?.click()}
                          disabled={uploading}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {occasion.image_url && (
                      <img
                        src={occasion.image_url}
                        alt={occasion.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal">
                        {occasion.title}
                      </h4>
                      <p className="text-stone text-sm">{occasion.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-stone mt-1">
                        <span>Icon: {occasion.icon_name}</span>
                        <span>•</span>
                        <span>Order: {occasion.sort_order}</span>
                        <span>•</span>
                        <span className={occasion.is_active ? 'text-green-600' : 'text-red-600'}>
                          {occasion.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(occasion)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(occasion.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GiftingOccasionsManager;
