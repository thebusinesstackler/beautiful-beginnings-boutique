
import { useEffect, useState } from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  location: string;
  product: string;
  timeAgo: string;
}

const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const notifications: Notification[] = [
    { id: 1, name: "Sarah M.", location: "New York, NY", product: "Personalized Snow Globe", timeAgo: "2 minutes ago" },
    { id: 2, name: "Jennifer K.", location: "Los Angeles, CA", product: "Photo Memory Necklace", timeAgo: "5 minutes ago" },
    { id: 3, name: "Ashley R.", location: "Chicago, IL", product: "Custom Photo Ornament", timeAgo: "8 minutes ago" },
    { id: 4, name: "Maria L.", location: "Houston, TX", product: "Slate Photo Keepsake", timeAgo: "12 minutes ago" },
    { id: 5, name: "Emma B.", location: "Phoenix, AZ", product: "Personalized Snow Globe", timeAgo: "15 minutes ago" },
    { id: 6, name: "Rachel T.", location: "Philadelphia, PA", product: "Photo Memory Necklace", timeAgo: "18 minutes ago" },
    { id: 7, name: "Lisa W.", location: "San Antonio, TX", product: "Custom Photo Ornament", timeAgo: "22 minutes ago" },
    { id: 8, name: "Amanda S.", location: "San Diego, CA", product: "Slate Photo Keepsake", timeAgo: "25 minutes ago" },
  ];

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000);

    // Then show notifications every 8-15 seconds
    const intervalTimer = setInterval(() => {
      const randomDelay = Math.random() * 7000 + 8000; // 8-15 seconds
      setTimeout(showNotification, randomDelay);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  if (!currentNotification || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left duration-500">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-1">
              <p className="text-sm font-semibold text-gray-900">{currentNotification.name}</p>
              <span className="text-xs text-gray-500">just ordered</span>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">
              {currentNotification.product}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{currentNotification.location}</span>
              </div>
              <span>{currentNotification.timeAgo}</span>
            </div>
          </div>
        </div>
        
        {/* Small pulse indicator */}
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofNotifications;
