
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, CreditCard, Package, Eye } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_amount: number;
  created_at: string;
  uploaded_images: string[];
  personalization_data: any;
  shipping_address: any;
  billing_address: any;
  payment_id: string;
  square_order_id: string;
  tracking_number: string;
  notes: string;
  fulfilled_at: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country || 'United States'}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load image:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
  };

  const handleImageClick = (imageUrl: string) => {
    console.log('Opening image:', imageUrl);
    window.open(imageUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-charcoal">
            Order Details #{order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Basic Info */}
          <div className="bg-cream/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Order Status</span>
              </div>
              <Badge variant={
                order.status === 'fulfilled' ? 'default' :
                order.status === 'paid' ? 'secondary' :
                order.status === 'pending' ? 'outline' : 'destructive'
              }>
                {order.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-stone font-medium">Total Amount:</span>
                <p className="text-lg font-bold text-charcoal">${order.total_amount?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-stone font-medium">Order Date:</span>
                <p className="text-charcoal">{formatDate(order.created_at)}</p>
              </div>
              {order.fulfilled_at && (
                <div>
                  <span className="text-stone font-medium">Fulfilled Date:</span>
                  <p className="text-charcoal">{formatDate(order.fulfilled_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-blush/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-sage" />
              <span className="font-medium text-charcoal">Customer Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone font-medium">Name:</span>
                <p className="text-charcoal">{order.customer_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-stone font-medium">Email:</span>
                <p className="text-charcoal">{order.customer_email}</p>
              </div>
              <div>
                <span className="text-stone font-medium">Phone:</span>
                <p className="text-charcoal">{order.customer_phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Customer Uploaded Images */}
          {order.uploaded_images && order.uploaded_images.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Customer Uploaded Images ({order.uploaded_images.length})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {order.uploaded_images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 bg-gray-100 rounded-lg border overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Customer upload ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(imageUrl)}
                        onError={handleImageError}
                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center pointer-events-none">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 break-all">{imageUrl}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-800 mt-2">Click on any image to view full size</p>
            </div>
          )}

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-sage/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Shipping Address</span>
              </div>
              <p className="text-charcoal text-sm">{formatAddress(order.shipping_address)}</p>
            </div>
          )}

          {/* Billing Address */}
          {order.billing_address && (
            <div className="bg-stone/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Billing Address</span>
              </div>
              <p className="text-charcoal text-sm">{formatAddress(order.billing_address)}</p>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-sage" />
              <span className="font-medium text-charcoal">Payment Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {order.payment_id && (
                <div>
                  <span className="text-stone font-medium">Payment ID:</span>
                  <p className="text-charcoal font-mono text-xs">{order.payment_id}</p>
                </div>
              )}
              {order.square_order_id && (
                <div>
                  <span className="text-stone font-medium">Square Order ID:</span>
                  <p className="text-charcoal font-mono text-xs">{order.square_order_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Personalization Data */}
          {order.personalization_data && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Personalization Details</span>
              </div>
              <pre className="text-sm text-charcoal bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(order.personalization_data, null, 2)}
              </pre>
            </div>
          )}

          {/* Tracking Information */}
          {order.tracking_number && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Shipping Information</span>
              </div>
              <div>
                <span className="text-stone font-medium">Tracking Number:</span>
                <p className="text-charcoal font-mono">{order.tracking_number}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-sage" />
                <span className="font-medium text-charcoal">Order Notes</span>
              </div>
              <p className="text-charcoal text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
