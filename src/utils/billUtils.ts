
import { MenuItem, restaurantInfo } from '../data/mockData';

export interface BillItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Bill {
  items: BillItem[];
  total: number;
  billNumber: string;
  date: Date;
}

// Format currency as USD
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date to a readable string
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate a unique bill number
export const generateBillNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `BILL-${timestamp}`;
};

// Calculate bill total
export const calculateTotal = (items: BillItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Create a new bill
export const createBill = (items: BillItem[]): Bill => {
  return {
    items,
    total: calculateTotal(items),
    billNumber: generateBillNumber(),
    date: new Date()
  };
};

// Filter items based on search query
export const filterItems = (items: MenuItem[], query: string): MenuItem[] => {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
};

// Get restaurant details for bill
export const getRestaurantInfo = () => {
  return restaurantInfo;
};

// Format bill for printing
export const formatBillForPrint = (bill: Bill): string => {
  const { name, address, phone } = restaurantInfo;
  
  let billText = `
    ${name}
    ${address}
    ${phone}
    
    Bill #: ${bill.billNumber}
    Date: ${formatDate(bill.date)}
    
    Items:
    ------------------------------------------
  `;
  
  bill.items.forEach(item => {
    billText += `
    ${item.name} x${item.quantity}
    ${formatCurrency(item.price)} each    ${formatCurrency(item.price * item.quantity)}
    `;
  });
  
  billText += `
    ------------------------------------------
    Total: ${formatCurrency(bill.total)}
    
    Thank you for dining with us!
  `;
  
  return billText;
};

export const generatePrintContent = (bill: Bill): string => {
  const { name, address, phone } = restaurantInfo;
  
  return `
    <div style="font-family: monospace; max-width: 400px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; font-size: 18px; font-weight: bold;">${name}</div>
      <div style="text-align: center;">${address}</div>
      <div style="text-align: center;">${phone}</div>
      
      <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
      
      <div>Bill #: ${bill.billNumber}</div>
      <div>Date: ${formatDate(bill.date)}</div>
      
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
          ${bill.items.map(item => `
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
        <div style="font-weight: bold;">${formatCurrency(bill.total)}</div>
      </div>
      
      <div style="margin: 20px 0; border-top: 1px dashed #000;"></div>
      
      <div style="text-align: center; margin-top: 30px;">Thank you for dining with us!</div>
    </div>
  `;
};

export const printBill = (bill: Bill): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const printContent = generatePrintContent(bill);
  
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>${restaurantInfo.name} - Bill ${bill.billNumber}</title>
      </head>
      <body>
        ${printContent}
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
