import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, CreditCard, Package, Eye, ShoppingBag, DollarSign } from 'lucide-react';

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
  customer_id: string;
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

  // Extract product information from Square checkout data
  const getProductDetails = () => {
    console.log('Full order personalization_data:', order.personalization_data);
    
    if (!order.personalization_data) {
      console.log('No personalization_data found');
      return [];
    }
    
    // Check for Square embedded payment items
    if (order.personalization_data.square_embedded_payment && order.personalization_data.items) {
      console.log('Found Square embedded payment items:', order.personalization_data.items);
      return order.personalization_data.items.map((item: any, index: number) => ({
        id: index,
        name: item.name || 'Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        uploadedPhotoUrl: item.uploadedPhotoUrl || null,
        hasPhoto: item.hasPhoto || false
      }));
    }
    
    // Check for cart items data
    if (Array.isArray(order.personalization_data)) {
      console.log('Found array of personalization data:', order.personalization_data);
      return order.personalization_data;
    }
    
    // Check for single product object
    if (typeof order.personalization_data === 'object') {
      console.log('Found single personalization object:', order.personalization_data);
      return [order.personalization_data];
    }
    
    console.log('No valid product data structure found');
    return [];
  };

  // Get all uploaded images from various sources
  const getAllUploadedImages = () => {
    const images = [];
    
    // Add images from order.uploaded_images
    if (order.uploaded_images && Array.isArray(order.uploaded_images)) {
      order.uploaded_images.forEach((imageUrl, index) => {
        images.push({
          url: imageUrl,
          source: 'order',
          index,
          description: `Order image ${index + 1}`
        });
      });
    }
    
    // Add images from personalization_data
    const products = getProductDetails();
    products.forEach((product: any, productIndex) => {
      if (product.uploadedPhotoUrl) {
        images.push({
          url: product.uploadedPhotoUrl,
          source: 'product',
          index: productIndex,
          description: `Product: ${product.name || 'Unknown'}`
        });
      }
    });
    
    // Also check for uploadedImages in personalization_data (from checkout)
    if (order.personalization_data && order.personalization_data.uploadedImages) {
      order.personalization_data.uploadedImages.forEach((imageUrl: string, index: number) => {
        images.push({
          url: imageUrl,
          source: 'checkout',
          index,
          description: `Checkout image ${index + 1}`
        });
      });
    }
    
    console.log('All collected images:', images);
    return images;
  };

  const productDetails = getProductDetails();
  const allImages = getAllUploadedImages();

  console.log('Order data:', order);
  console.log('Product details extracted:', productDetails);
  console.log('All images found:', allImages);

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

          {/* Products Ordered - Enhanced for order fulfillment */}
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-green-600" />
              <span className="font-bold text-lg text-charcoal">Products to Fulfill</span>
            </div>
            
            {productDetails.length > 0 ? (
              <div className="grid gap-4">
                {productDetails.map((product: any, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-300 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-charcoal mb-2">
                          {product.name || 'Product'}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-stone">Product Name:</span>
                            <p className="text-charcoal">{product.name || 'Product from order'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-stone">Price:</span>
                            <p className="text-charcoal font-semibold">
                              {product.price ? (typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : `$${(product.price / 100).toFixed(2)}`) : `$${(order.total_amount / (productDetails.length || 1)).toFixed(2)}`}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-stone">Quantity:</span>
                            <p className="text-charcoal">{product.quantity || 1}</p>
                          </div>
                          {product.id && (
                            <div>
                              <span className="font-medium text-stone">Product ID:</span>
                              <p className="text-charcoal font-mono text-xs">{product.id}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Product customization details */}
                    {Object.keys(product).filter(k => !['name', 'price', 'quantity', 'id', 'image', 'uploadedPhoto', 'uploadedPhotoUrl', 'willUploadLater', 'hasPhoto'].includes(k)).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <h5 className="text-sm font-medium text-charcoal mb-2">Customization Details:</h5>
                        <div className="space-y-1 text-xs">
                          {Object.entries(product)
                            .filter(([k]) => !['name', 'price', 'quantity', 'id', 'image', 'uploadedPhoto', 'uploadedPhotoUrl', 'willUploadLater', 'hasPhoto'].includes(k))
                            .map(([k, v]: [string, any]) => (
                              <div key={k} className="flex justify-between">
                                <span className="font-medium text-stone capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-charcoal">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <p className="text-gray-600">Product details not available in standard format.</p>
                <p className="text-sm text-gray-500 mt-1">Order total: ${order.total_amount?.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-2">Raw data available in order notes section below</p>
              </div>
            )}
          </div>

          {/* Customer Uploaded Images - Enhanced display */}
          {allImages && allImages.length > 0 ? (
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg text-charcoal">
                  Customer Uploaded Images ({allImages.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allImages.map((imageData, index) => (
                  <div key={`${imageData.source}-${imageData.index}`} className="relative group bg-white rounded-lg p-2 shadow-md">
                    <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img
                        src={imageData.url}
                        alt={imageData.description}
                        className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleImageClick(imageData.url)}
                        onError={handleImageError}
                        onLoad={() => console.log('Image loaded successfully:', imageData.url)}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="absolute inset-2 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-opacity flex items-center justify-center pointer-events-none">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2 p-2">
                      <p className="text-xs text-blue-600 font-medium">{imageData.description}</p>
                      <p className="text-xs text-gray-500 capitalize">Source: {imageData.source}</p>
                      <p className="text-xs text-gray-600 break-all font-mono bg-gray-100 p-1 rounded mt-1">
                        {imageData.url}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-4 font-medium">
                📸 Click on any image to view full size in a new tab
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">No images uploaded by customer</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Checked: order.uploaded_images, personalization_data.uploadedImages, and product.uploadedPhotoUrl
              </p>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-blush/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-sage" />
              <span className="font-medium text-charcoal">Customer Information</span>
              {order.customer_id && (
                <Badge variant="outline" className="ml-2">
                  Customer ID: {order.customer_id.slice(0, 8)}
                </Badge>
              )}
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

          {/* Notes & Raw Data for Debugging */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-sage" />
              <span className="font-medium text-charcoal">Order Data & Notes</span>
            </div>
            {order.notes && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-charcoal mb-2">Order Notes:</h5>
                <p className="text-charcoal text-sm">{order.notes}</p>
              </div>
            )}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-charcoal mb-2">Raw Personalization Data (for debugging):</h5>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-40 text-gray-700">
                {JSON.stringify(order.personalization_data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
