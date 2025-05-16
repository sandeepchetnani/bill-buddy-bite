
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Trash2, Printer } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
  
  const handleDeleteOrder = async (orderId: string) => {
    try {
      setDeletingId(orderId);
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
        
      if (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
        return;
      }
      
      // Remove the deleted order from state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setDeletingId(null);
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
      <div className="container max-w-7xl mx-auto py-4 px-2 sm:px-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleBackButtonClick}
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back {isAdmin() ? 'to Home' : 'to Tables'}
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg sm:text-xl">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Order #</TableHead>
                      <TableHead className="w-[80px]">Table</TableHead>
                      <TableHead className="hidden sm:table-cell">Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{`${order.table_block}${order.table_number}`}</TableCell>
                        <TableCell className="hidden sm:table-cell">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 sm:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewOrder(order)}
                              className="h-8 px-2 sm:px-3"
                            >
                              <Eye className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 px-2 sm:px-3 text-red-500 hover:text-red-600 hover:border-red-300"
                                >
                                  <Trash2 className="h-3 w-3 sm:mr-1" />
                                  <span className="hidden sm:inline">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete order {order.order_number}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteOrder(order.id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    {deletingId === order.id ? (
                                      <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                      </span>
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
                {restaurantInfo.name}
              </DialogTitle>
              <div className="text-center text-sm text-muted-foreground">
                <p>{restaurantInfo.address}</p>
                <p>{restaurantInfo.phone}</p>
              </div>
            </DialogHeader>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between mb-2 flex-wrap gap-1">
                <span className="font-semibold">Order #{selectedOrder?.order_number}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">
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
                      <div className="font-medium text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <span className="font-semibold text-sm sm:text-base">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between text-base sm:text-lg font-bold">
                <span>Total</span>
                <span>{selectedOrder ? formatCurrency(selectedOrder.total) : ''}</span>
              </div>
            </div>

            <div className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">
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
