
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Percent, DollarSign } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  minimum_order: number;
  usage_limit: number;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}

const MarketingTools = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minimum_order: '',
    usage_limit: '',
    starts_at: '',
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch promo codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const promoData = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        is_active: formData.is_active
      };

      if (editingPromo) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingPromo.id);

        if (error) throw error;
        toast({ title: "Success", description: "Promo code updated successfully" });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([promoData]);

        if (error) throw error;
        toast({ title: "Success", description: "Promo code created successfully" });
      }

      setShowForm(false);
      setEditingPromo(null);
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast({
        title: "Error",
        description: "Failed to save promo code",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      type: promo.type,
      value: promo.value.toString(),
      minimum_order: promo.minimum_order?.toString() || '',
      usage_limit: promo.usage_limit?.toString() || '',
      starts_at: promo.starts_at ? new Date(promo.starts_at).toISOString().split('T')[0] : '',
      expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().split('T')[0] : '',
      is_active: promo.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (promoId: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', promoId);

      if (error) throw error;
      toast({ title: "Success", description: "Promo code deleted successfully" });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minimum_order: '',
      usage_limit: '',
      starts_at: '',
      expires_at: '',
      is_active: true
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading marketing tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Marketing Tools</h2>
          <p className="text-stone">Create and manage promotional campaigns</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-sage hover:bg-sage/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Promo Code
        </Button>
      </div>

      {showForm && (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">{editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}</CardTitle>
            <CardDescription>
              {editingPromo ? 'Update promotional code settings' : 'Create a new discount code'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-charcoal">Promo Code *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER20"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode} className="border-stone text-charcoal hover:bg-cream/50">
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="type" className="text-charcoal">Discount Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value" className="text-charcoal">Discount Value *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_order" className="text-charcoal">Minimum Order Amount</Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order}
                    onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <Label htmlFor="usage_limit" className="text-charcoal">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="starts_at" className="text-charcoal">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at" className="text-charcoal">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-sage hover:bg-sage/90 text-white">
                  {editingPromo ? 'Update Promo Code' : 'Create Promo Code'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPromo(null);
                    resetForm();
                  }}
                  className="border-stone text-charcoal hover:bg-cream/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Promo Codes ({promoCodes.length})</CardTitle>
          <CardDescription>Manage your promotional discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promoCodes.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div>
                  <h3 className="font-medium flex items-center space-x-2">
                    <span className="text-charcoal">{promo.code}</span>
                    {promo.type === 'percentage' ? (
                      <Badge variant="outline">
                        <Percent className="h-3 w-3 mr-1" />
                        {promo.value}% off
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${promo.value} off
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={promo.is_active ? "default" : "secondary"}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {promo.minimum_order && (
                      <span className="text-sm text-stone">
                        Min: ${promo.minimum_order}
                      </span>
                    )}
                    {promo.usage_limit && (
                      <span className="text-sm text-stone">
                        Used: {promo.used_count || 0}/{promo.usage_limit}
                      </span>
                    )}
                  </div>
                  {promo.expires_at && (
                    <p className="text-sm text-stone mt-1">
                      Expires: {new Date(promo.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(promo)}
                    className="border-stone text-charcoal hover:bg-cream/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(promo.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {promoCodes.length === 0 && (
              <p className="text-center py-8 text-stone">No promo codes found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingTools;
