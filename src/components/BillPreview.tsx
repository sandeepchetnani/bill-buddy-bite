
import React from 'react';
import { Bill, formatCurrency, printBill } from '../utils/billUtils';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { restaurantInfo } from '../data/mockData';
import { Printer, ScanQrCode } from 'lucide-react';

interface BillPreviewProps {
  bill: Bill;
  onClose: () => void;
}

const BillPreview: React.FC<BillPreviewProps> = ({ bill, onClose }) => {
  const handlePrint = () => {
    printBill(bill);
  };

  const formattedDate = new Date(bill.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold text-black">
            {restaurantInfo.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>{restaurantInfo.address}</p>
            <p>{restaurantInfo.phone}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-1">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Bill #{bill.billNumber}</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="border-t border-b py-2 space-y-2">
            {bill.items.map((item) => (
              <div 
                key={item.itemId} 
                className="flex justify-between"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
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
          
          <div className="mt-1 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(bill.total)}</span>
          </div>
          
          <div className="mt-1 border-t pt-4 flex flex-col items-center">
            <img 
              src="/lovable-uploads/b2940951-247a-49d5-810b-dfb112ccb936.png" 
              alt="Payment QR Code" 
              className="w-36 h-36 object-contain"
            />
          </div>
          
          <div className="text-center mt-2 text-sm text-muted-foreground">
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-restaurant-primary hover:bg-restaurant-secondary">
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillPreview;
