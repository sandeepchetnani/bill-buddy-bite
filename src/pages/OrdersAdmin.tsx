
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
} from "@/components/ui/dialog";

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
  
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/tables')}
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tables
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
        
        {/* View Order Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Order #{selectedOrder?.order_number} - Table {selectedOrder?.table_block}{selectedOrder?.table_number}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{selectedOrder ? formatCurrency(selectedOrder.total) : ''}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 text-sm text-muted-foreground">
                Order created on {selectedOrder ? new Date(selectedOrder.created_at).toLocaleString() : ''}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Print-only order details section */}
        {selectedOrder && (
          <div className="hidden print:block p-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">Order Receipt</h1>
              <p className="text-muted-foreground">Order #{selectedOrder.order_number}</p>
              <p className="text-muted-foreground">
                Table {selectedOrder.table_block}{selectedOrder.table_number} - 
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Thank you for your order!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
