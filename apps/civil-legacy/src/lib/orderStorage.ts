const STORAGE_KEY = 'clc_recent_orders';

export interface RecentOrder {
  orderId: string;
  orderNumber: string;
  date: string;
}

export function getRecentOrders(): RecentOrder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load recent orders", e);
    return [];
  }
}

export function addRecentOrder(orderId: string, orderNumber: string) {
  try {
    const orders = getRecentOrders();
    // Avoid duplicates
    if (orders.find(o => o.orderId === orderId)) return;
    
    const newOrder: RecentOrder = {
      orderId,
      orderNumber,
      date: new Date().toISOString(),
    };
    
    // Keep only the last 5 orders
    const updated = [newOrder, ...orders].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save recent order", e);
  }
}

export function removeRecentOrder(orderId: string) {
  try {
    const orders = getRecentOrders();
    const updated = orders.filter(o => o.orderId !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to remove recent order", e);
  }
}

export function shouldShowDeleteWarning(): boolean {
  const lastWarned = localStorage.getItem('clc_delete_warn_date');
  if (!lastWarned) return true;
  
  const lastDate = new Date(lastWarned);
  const now = new Date();
  
  // Return true if it's a different day
  return lastDate.toDateString() !== now.toDateString();
}

export function markDeleteWarningShown() {
  localStorage.setItem('clc_delete_warn_date', new Date().toISOString());
}
