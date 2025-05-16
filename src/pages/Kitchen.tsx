import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../integrations/supabase/client';
import { BillItem } from '../utils/billUtils';
import { formatCurrency } from '../utils/billUtils';
import { Json } from '../integrations/supabase/types';

interface Order {
  id: string;
  table_block: string;
  table_number: string;
  table_id: string;
  items: BillItem[];
  total: number;
  order_number: string;
  created_at: string;
  status: string;
}

// Helper function to convert Json to BillItem[]
const convertJsonToBillItems = (jsonItems: Json): BillItem[] => {
  if (!jsonItems || typeof jsonItems !== 'object') {
    return [];
  }
  
  try {
    // Handle the case where jsonItems might already be an array
    if (Array.isArray(jsonItems)) {
      // We need to verify each item has the required BillItem properties
      return jsonItems.filter((item): item is BillItem => 
        item !== null && 
        typeof item === 'object' && 
        'itemId' in item && 
        'name' in item && 
        'price' in item && 
        'quantity' in item
      );
    }
    
    // If it's a string (JSON string), try to parse it
    if (typeof jsonItems === 'string') {
      const parsedItems = JSON.parse(jsonItems);
      if (Array.isArray(parsedItems)) {
        return parsedItems.filter((item): item is BillItem => 
          item !== null && 
          typeof item === 'object' && 
          'itemId' in item && 
          'name' in item && 
          'price' in item && 
          'quantity' in item
        );
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error converting JSON to BillItems:', error);
    return [];
  }
};

const Kitchen = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create notification sound element
    notificationSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');

    // Initial fetch of active orders
    fetchOrders();
    
    // Set up real-time subscription for new orders
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders' 
        }, 
        (payload) => {
          const newOrderData = payload.new as any;
          // Convert JSON items to BillItem[]
          const newOrder: Order = {
            ...newOrderData,
            items: convertJsonToBillItems(newOrderData.items)
          };
          
          // Add the new order and play notification sound
          setOrders(prevOrders => {
            // Check if we actually have a new order that's not already in the list
            const isNewOrder = !prevOrders.some(order => order.id === newOrder.id);
            
            if (isNewOrder) {
              setNewOrderAlert(true);
              if (notificationSound.current) {
                notificationSound.current.play().catch(e => console.error("Error playing notification sound:", e));
              }
              toast.success(`New order from Table ${newOrder.table_block}${newOrder.table_number}`);
              return [newOrder, ...prevOrders];
            }
            return prevOrders;
          });
        })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert JSON items to BillItem[] for each order
      const ordersWithBillItems: Order[] = (data || []).map(order => ({
        ...order,
        items: convertJsonToBillItems(order.items)
      }));
      
      setOrders(ordersWithBillItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleOrderComplete = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
      
      toast.success('Order marked as complete');
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-4 px-2 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-restaurant-primary">
              Kitchen Orders
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage incoming orders
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="self-end"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="grid gap-3 sm:gap-4 md:gap-6">
          {newOrderAlert && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md flex justify-between items-center">
              <span className="font-medium">New orders received!</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNewOrderAlert(false)}
              >
                Dismiss
              </Button>
            </div>
          )}
          
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No orders to display</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="bg-restaurant-primary text-white px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg sm:text-xl">
                      Table {order.table_block}{order.table_number}
                    </span>
                    <Badge variant="outline" className="text-white border-white">
                      Order #{order.order_number.split('-')[1]}
                    </Badge>
                  </div>
                  <div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleOrderComplete(order.id)}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div 
                        key={`${order.id}-${index}`} 
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
