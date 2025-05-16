
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, Eye } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { formatCurrency } from '../utils/billUtils';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { restaurantInfo } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface Order {
  id: string;
  table_id: string;
  table_block: string;
  table_number: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  order_number: string;
  status: string;
  created_at: string;
}

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
        return;
      }
      
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrintOrder = (order: Order) => {
    setSelectedOrder(order);
    
    // Use setTimeout to allow the modal to render before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  // Navigate based on user role
  const handleBackButtonClick = () => {
    if (isAdmin()) {
      navigate('/');  // Admin goes to home page
    } else {
      navigate('/tables');  // Waiter goes to tables page
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleBackButtonClick}
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back {isAdmin() ? 'to Home' : 'to Tables'}
            </Button>
            <h1 className="text-2xl font-bold">Orders Management</h1>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{`${order.table_block}${order.table_number}`}</TableCell>
                        <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handlePrintOrder(order)}
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* View Order Dialog - Styled similar to BillPreview */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                {restaurantInfo.name}
              </DialogTitle>
              <div className="text-center text-sm text-muted-foreground">
                <p>{restaurantInfo.address}</p>
                <p>{restaurantInfo.phone}</p>
              </div>
            </DialogHeader>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order #{selectedOrder?.order_number}</span>
                <span className="text-muted-foreground">
                  {selectedOrder ? new Date(selectedOrder.created_at).toLocaleString() : ''}
                </span>
              </div>
              
              <div className="space-y-3">
                {selectedOrder?.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{selectedOrder ? formatCurrency(selectedOrder.total) : ''}</span>
              </div>
            </div>

            <div className="text-center mt-2 text-sm text-muted-foreground">
              <p>Thank you for dining with us!</p>
              <p>Table {selectedOrder?.table_block}{selectedOrder?.table_number}</p>
            </div>
            
            <DialogFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => handlePrintOrder(selectedOrder!)} variant="default">
                <Printer className="mr-2 h-4 w-4" />
                Print Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Print-only order details section */}
        {selectedOrder && (
          <div className="hidden print:block p-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">{restaurantInfo.name}</h1>
              <p className="text-muted-foreground">{restaurantInfo.address}</p>
              <p className="text-muted-foreground">{restaurantInfo.phone}</p>
              <div className="my-4 border-t border-b py-2">
                <p className="font-semibold">Order #{selectedOrder.order_number}</p>
                <p className="text-sm">
                  Table {selectedOrder.table_block}{selectedOrder.table_number} - 
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm">{formatCurrency(item.price)} × {item.quantity}</div>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(selectedOrder.total)}</span>
            </div>
            
            <div className="mt-8 text-center text-sm">
              <p>Thank you for your order!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
