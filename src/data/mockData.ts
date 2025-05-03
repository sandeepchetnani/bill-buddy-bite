
// Mock menu items
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const menuItems: MenuItem[] = [
  // Appetizers
  { id: 'app1', name: 'Garlic Bread', price: 4.99, category: 'Appetizers' },
  { id: 'app2', name: 'Mozzarella Sticks', price: 6.99, category: 'Appetizers' },
  { id: 'app3', name: 'Chicken Wings', price: 9.99, category: 'Appetizers' },
  { id: 'app4', name: 'Loaded Nachos', price: 8.99, category: 'Appetizers' },
  
  // Main Courses
  { id: 'main1', name: 'Chicken Alfredo Pasta', price: 14.99, category: 'Main Courses' },
  { id: 'main2', name: 'BBQ Ribs', price: 18.99, category: 'Main Courses' },
  { id: 'main3', name: 'Vegetable Stir Fry', price: 12.99, category: 'Main Courses' },
  { id: 'main4', name: 'Grilled Salmon', price: 17.99, category: 'Main Courses' },
  { id: 'main5', name: 'Cheeseburger', price: 11.99, category: 'Main Courses' },
  { id: 'main6', name: 'Margherita Pizza', price: 13.99, category: 'Main Courses' },
  
  // Sides
  { id: 'side1', name: 'French Fries', price: 3.99, category: 'Sides' },
  { id: 'side2', name: 'Mashed Potatoes', price: 4.99, category: 'Sides' },
  { id: 'side3', name: 'Side Salad', price: 5.99, category: 'Sides' },
  { id: 'side4', name: 'Steamed Vegetables', price: 4.99, category: 'Sides' },
  
  // Beverages
  { id: 'bev1', name: 'Soft Drink', price: 2.99, category: 'Beverages' },
  { id: 'bev2', name: 'Iced Tea', price: 2.99, category: 'Beverages' },
  { id: 'bev3', name: 'Coffee', price: 3.49, category: 'Beverages' },
  { id: 'bev4', name: 'Fresh Juice', price: 4.99, category: 'Beverages' },
  
  // Desserts
  { id: 'des1', name: 'Chocolate Cake', price: 6.99, category: 'Desserts' },
  { id: 'des2', name: 'Cheesecake', price: 7.99, category: 'Desserts' },
  { id: 'des3', name: 'Ice Cream Sundae', price: 5.99, category: 'Desserts' },
  { id: 'des4', name: 'Apple Pie', price: 6.99, category: 'Desserts' },
];

// Mock transaction history
export interface Transaction {
  id: string;
  billNumber: string;
  date: string;
  total: number;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const transactionHistory: Transaction[] = [
  {
    id: 't1',
    billNumber: 'BILL-001',
    date: '2025-05-01T18:30:00',
    total: 45.95,
    items: [
      { itemId: 'app1', name: 'Garlic Bread', price: 4.99, quantity: 1 },
      { itemId: 'main1', name: 'Chicken Alfredo Pasta', price: 14.99, quantity: 2 },
      { itemId: 'bev1', name: 'Soft Drink', price: 2.99, quantity: 2 },
      { itemId: 'des1', name: 'Chocolate Cake', price: 6.99, quantity: 1 },
    ]
  },
  {
    id: 't2',
    billNumber: 'BILL-002',
    date: '2025-05-02T19:45:00',
    total: 52.94,
    items: [
      { itemId: 'app3', name: 'Chicken Wings', price: 9.99, quantity: 1 },
      { itemId: 'main5', name: 'Cheeseburger', price: 11.99, quantity: 2 },
      { itemId: 'side1', name: 'French Fries', price: 3.99, quantity: 2 },
      { itemId: 'bev4', name: 'Fresh Juice', price: 4.99, quantity: 2 },
    ]
  },
  {
    id: 't3',
    billNumber: 'BILL-003',
    date: '2025-05-02T20:15:00',
    total: 31.97,
    items: [
      { itemId: 'main3', name: 'Vegetable Stir Fry', price: 12.99, quantity: 1 },
      { itemId: 'main6', name: 'Margherita Pizza', price: 13.99, quantity: 1 },
      { itemId: 'bev1', name: 'Soft Drink', price: 2.99, quantity: 1 },
      { itemId: 'bev2', name: 'Iced Tea', price: 2.99, quantity: 1 },
    ]
  },
  {
    id: 't4',
    billNumber: 'BILL-004',
    date: '2025-05-03T12:30:00',
    total: 38.96,
    items: [
      { itemId: 'app2', name: 'Mozzarella Sticks', price: 6.99, quantity: 1 },
      { itemId: 'main2', name: 'BBQ Ribs', price: 18.99, quantity: 1 },
      { itemId: 'side2', name: 'Mashed Potatoes', price: 4.99, quantity: 1 },
      { itemId: 'bev3', name: 'Coffee', price: 3.49, quantity: 2 },
    ]
  },
];

// Restaurant details
export const restaurantInfo = {
  name: "Purple Plate",
  address: "123 Dining Street, Foodville, CA 90210",
  phone: "(555) 123-4567",
  email: "contact@purpleplate.com",
  website: "www.purpleplate.com"
};
