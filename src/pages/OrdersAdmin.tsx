
import React, { useEffect, useState, useRef } from 'react';
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
  DialogDescription,
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
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
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
    if (!order) return;
    
    // Generate print content
    const printContent = generatePrintContent(order);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print the order.');
      return;
    }
    
    // Write the print content to the new window
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${restaurantInfo.name} - Order ${order.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 380px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; font-size: 14px; color: #666; }
            .order-info { margin-bottom: 20px; font-size: 14px; }
            .items { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 15px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .item-details { flex: 1; }
            .item-name { font-weight: bold; }
            .item-price { color: #666; font-size: 13px; }
            .item-total { font-weight: bold; }
            .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 15px; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${restaurantInfo.name}</h1>
              <p>${restaurantInfo.address}</p>
              <p>${restaurantInfo.phone}</p>
            </div>
            
            <div class="order-info">
              <p><strong>Order #${order.order_number}</strong></p>
              <p>${new Date(order.created_at).toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
              })}</p>
              <p>Table ${order.table_block}${order.table_number}</p>
            </div>
            
            <div class="items">
              ${order.items.map(item => `
                <div class="item">
                  <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${formatCurrency(item.price)} × ${item.quantity}</div>
                  </div>
                  <div class="item-total">${formatCurrency(item.price * item.quantity)}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              <span>Total</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
            
            <div class="footer">
              <p>Thank you for dining with us!</p>
              <p>Please visit again</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const generatePrintContent = (order: Order) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; font-size: 18px; font-weight: bold;">${restaurantInfo.name}</div>
        <div style="text-align: center;">${restaurantInfo.address}</div>
        <div style="text-align: center;">${restaurantInfo.phone}</div>
        
        <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
        
        <div>Order #: ${order.order_number}</div>
        <div>Date: ${new Date(order.created_at).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata'
        })}</div>
        <div>Table: ${order.table_block}${order.table_number}</div>
        
        <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="text-align: left;">${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${formatCurrency(item.price)}</td>
                <td style="text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
        
        <div style="display: flex; justify-content: space-between;">
          <div style="font-weight: bold;">Total:</div>
          <div style="font-weight: bold;">${formatCurrency(order.total)}</div>
        </div>
        
        <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
        
        <div style="text-align: center; margin-top: 15px;">Thank you for dining with us!</div>
      </div>
    `;
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
      <div className="container max-w-7xl mx-auto py-4 px-2 sm:px-4 sm:py-6 print:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 print:hidden">
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
        
        <Card className="print:shadow-none print:border-0">
          <CardHeader className="py-4 print:hidden">
            <CardTitle className="text-lg sm:text-xl">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent className="print:p-0">
            {loading ? (
              <div className="flex justify-center py-10 print:hidden">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground print:hidden">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0 print:mx-0 print:hidden">
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto print:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
                {restaurantInfo.name}
              </DialogTitle>
              <DialogDescription className="text-center">
                <p>{restaurantInfo.address}</p>
                <p>{restaurantInfo.phone}</p>
              </DialogDescription>
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
              <Button 
                onClick={() => selectedOrder && handlePrintOrder(selectedOrder)} 
                variant="default"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Hidden iframe for printing (not using this approach anymore) */}
        <iframe 
          ref={printFrameRef}
          style={{ display: 'none' }} 
          title="Print Frame"
        />
      </div>
    </div>
  );
};

export default OrdersAdmin;
