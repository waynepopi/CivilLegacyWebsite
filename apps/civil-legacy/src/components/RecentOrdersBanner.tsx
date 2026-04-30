import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRecentOrders, RecentOrder, removeRecentOrder, shouldShowDeleteWarning, markDeleteWarningShown } from '@/lib/orderStorage';
import { Clock, X, ArrowRight, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

export const RecentOrdersBanner = () => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load orders on mount and whenever location changes
    setOrders(getRecentOrders());
  }, [location.pathname]);

  if (orders.length === 0) return null;

  // Don't show on checkout or payment pages to avoid distraction
  const hidePaths = ['/Checkout', '/mock-payment', '/payment/status', '/payment/success'];
  if (hidePaths.some(path => location.pathname.includes(path))) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (shouldShowDeleteWarning()) {
      setShowWarning(id);
    } else {
      removeRecentOrder(id);
      setOrders(getRecentOrders());
    }
  };

  const confirmRemove = () => {
    if (!showWarning) return;
    removeRecentOrder(showWarning);
    setOrders(getRecentOrders());
    markDeleteWarningShown();
    setShowWarning(null);
  };

  const handleNavigate = (orderId: string) => {
    navigate(`/payment/status/${orderId}`);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start">
      {isOpen && (
        <Card className="mb-4 w-72 md:w-80 p-6 bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
              {showWarning ? "Confirm Removal" : "Recent Orders"}
            </h4>
            <button onClick={() => { setIsOpen(false); setShowWarning(null); }} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          
          {showWarning ? (
            <div className="space-y-6 py-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl">
                <p className="text-[10px] font-bold text-red-600 dark:text-red-400 leading-relaxed">
                  IMPORTANT: Removing this from history will permanently lose the link to this order. Ensure you have bookmarked the status page or saved the receipt.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowWarning(null)}
                  variant="outline"
                  className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmRemove}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  Remove
                </Button>
              </div>
              <p className="text-[9px] text-center text-gray-400 font-medium">This warning will only show once today.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {orders.map((order) => (
                <div 
                  key={order.orderId}
                  onClick={() => handleNavigate(order.orderId)}
                  className="group p-4 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-500/30 rounded-2xl cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleRemove(e, order.orderId)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button 
            variant="ghost" 
            className="w-full mt-4 text-[10px] font-black uppercase tracking-widest h-10 hover:bg-gray-100 dark:hover:bg-white/5"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </Card>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group relative",
          isOpen ? "bg-black text-white" : "bg-blue-600 text-white hover:scale-110"
        )}
      >
        {isOpen ? <X size={20} /> : <ClipboardList size={20} />}
        
        {!isOpen && orders.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black animate-bounce">
            {orders.length}
          </span>
        )}
      </button>
    </div>
  );
};
