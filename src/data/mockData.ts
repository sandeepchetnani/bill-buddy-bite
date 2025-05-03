
// Mock menu items
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const menuItems: MenuItem[] = [
  // Indian Starters
  { id: 'ist1', name: 'Hara Bhara Kabab', price: 240, category: 'Indian Starters' },
  { id: 'ist2', name: 'Aloo Corn Tikki', price: 240, category: 'Indian Starters' },
  { id: 'ist3', name: 'Cheese Ball', price: 280, category: 'Indian Starters' },
  { id: 'ist4', name: 'Bhuna Chicken', price: 300, category: 'Indian Starters' },
  { id: 'ist5', name: 'Bhuna Mutton', price: 380, category: 'Indian Starters' },
  { id: 'ist6', name: 'Fish Fry/Amritsary', price: 380, category: 'Indian Starters' },
  { id: 'ist7', name: 'Prawns Koliwada', price: 400, category: 'Indian Starters' },
  
  // Tandoor Veg
  { id: 'tveg1', name: 'Paneer Tikka/Achari', price: 280, category: 'Tandoor' },
  { id: 'tveg2', name: 'Veg Seek Kabab', price: 290, category: 'Tandoor' },
  { id: 'tveg3', name: 'Paneer Pahadi/Malai', price: 290, category: 'Tandoor' },
  { id: 'tveg4', name: 'Tandoori Mushroom', price: 300, category: 'Tandoor' },
  { id: 'tveg5', name: 'Paneer Peri-Peri Tikka', price: 310, category: 'Tandoor' },
  { id: 'tveg6', name: 'Paneer Kali Miri Tikka', price: 320, category: 'Tandoor' },
  
  // Tandoor Non-Veg
  { id: 'tnveg1', name: 'Chicken Tikka/Achari', price: 330, category: 'Tandoor' },
  { id: 'tnveg2', name: 'Chicken Seek Kabab', price: 350, category: 'Tandoor' },
  { id: 'tnveg3', name: 'Chicken Pahadi/Malai', price: 350, category: 'Tandoor' },
  { id: 'tnveg4', name: 'Chicken Garlic Tikka', price: 360, category: 'Tandoor' },
  { id: 'tnveg5', name: 'Fish Peri-Peri Tikka', price: 360, category: 'Tandoor' },
  { id: 'tnveg6', name: 'Tandoori Chicken Half', price: 300, category: 'Tandoor' },
  { id: 'tnveg7', name: 'Tandoori Chicken Full', price: 500, category: 'Tandoor' },
  { id: 'tnveg8', name: 'Chicken Oil Rost Full', price: 500, category: 'Tandoor' },
  { id: 'tnveg9', name: 'Tandoori Prawns', price: 420, category: 'Tandoor' },
  
  // Main Course Veg
  { id: 'mcv1', name: 'Veg Kheema Kasturi', price: 220, category: 'Main Course Veg' },
  { id: 'mcv2', name: 'Veg Anda Curry', price: 220, category: 'Main Course Veg' },
  { id: 'mcv3', name: 'Veg Sanj Savera', price: 230, category: 'Main Course Veg' },
  { id: 'mcv4', name: 'Veg Kolhapuri', price: 230, category: 'Main Course Veg' },
  { id: 'mcv5', name: 'Veg Bhuna', price: 240, category: 'Main Course Veg' },
  { id: 'mcv6', name: 'Rani Palak', price: 250, category: 'Main Course Veg' },
  { id: 'mcv7', name: 'Aloo Gobhi Adraki', price: 260, category: 'Main Course Veg' },
  { id: 'mcv8', name: 'Mushroom Masala', price: 260, category: 'Main Course Veg' },
  { id: 'mcv9', name: 'Baby Corn Mushroom Masala', price: 280, category: 'Main Course Veg' },
  { id: 'mcv10', name: 'Malai Kofta', price: 280, category: 'Main Course Veg' },
  { id: 'mcv11', name: 'Veg Navratna Korma', price: 290, category: 'Main Course Veg' },
  { id: 'mcv12', name: 'Paneer Angara Sizzler', price: 300, category: 'Main Course Veg' },
  { id: 'mcv13', name: 'Paneer Butter Masala', price: 300, category: 'Main Course Veg' },
  { id: 'mcv14', name: 'Paneer Saoji', price: 300, category: 'Main Course Veg' },
  { id: 'mcv15', name: 'Paneer Joshila', price: 310, category: 'Main Course Veg' },
  { id: 'mcv16', name: 'Paneer Takatak', price: 310, category: 'Main Course Veg' },
  { id: 'mcv17', name: 'Paneer Bhurjee/Curry', price: 310, category: 'Main Course Veg' },
  { id: 'mcv18', name: 'Kadhai Paneer', price: 310, category: 'Main Course Veg' },
  { id: 'mcv19', name: 'Paneer Tikka Masala', price: 310, category: 'Main Course Veg' },
  { id: 'mcv20', name: 'Paneer Lababdar', price: 310, category: 'Main Course Veg' },
  { id: 'mcv21', name: 'Paneer Pasandida', price: 310, category: 'Main Course Veg' },
  
  // Main Course Non-Veg
  { id: 'mcnv1', name: 'Egg Bhurjee/Curry', price: 200, category: 'Main Course Non-Veg' },
  { id: 'mcnv2', name: 'Chicken Varhadi', price: 280, category: 'Main Course Non-Veg' },
  { id: 'mcnv3', name: 'Chicken Tikka Masala', price: 300, category: 'Main Course Non-Veg' },
  { id: 'mcnv4', name: 'Chicken Kolhapuri', price: 300, category: 'Main Course Non-Veg' },
  { id: 'mcnv5', name: 'Chicken Rara Masala', price: 300, category: 'Main Course Non-Veg' },
  { id: 'mcnv6', name: 'Chicken Bhuna Masala', price: 300, category: 'Main Course Non-Veg' },
  { id: 'mcnv7', name: 'Chicken Curry', price: 300, category: 'Main Course Non-Veg' },
  { id: 'mcnv8', name: 'Chicken Saoji', price: 320, category: 'Main Course Non-Veg' },
  { id: 'mcnv9', name: 'Chicken Kadhai', price: 320, category: 'Main Course Non-Veg' },
  { id: 'mcnv10', name: 'Chicken Angara', price: 350, category: 'Main Course Non-Veg' },
  { id: 'mcnv11', name: 'Butter Chicken', price: 360, category: 'Main Course Non-Veg' },
  { id: 'mcnv12', name: 'Fish Curry', price: 360, category: 'Main Course Non-Veg' },
  { id: 'mcnv13', name: 'Mutton Varhadi', price: 380, category: 'Main Course Non-Veg' },
  { id: 'mcnv14', name: 'Mutton Roganjosh', price: 380, category: 'Main Course Non-Veg' },
  { id: 'mcnv15', name: 'Mutton Curry', price: 380, category: 'Main Course Non-Veg' },
  { id: 'mcnv16', name: 'Mutton Mirch Korma', price: 400, category: 'Main Course Non-Veg' },
  { id: 'mcnv17', name: 'Mutton Saoji', price: 400, category: 'Main Course Non-Veg' },
  { id: 'mcnv18', name: 'Mutton Kolhapuri', price: 400, category: 'Main Course Non-Veg' },
  { id: 'mcnv19', name: 'Prawns Curry', price: 450, category: 'Main Course Non-Veg' },
  
  // Oriental Starters
  { id: 'oveg1', name: 'Crispy Veg', price: 220, category: 'Oriental Starters' },
  { id: 'oveg2', name: 'Crispy Corn', price: 230, category: 'Oriental Starters' },
  { id: 'oveg3', name: 'Veg Manchurian', price: 230, category: 'Oriental Starters' },
  { id: 'oveg4', name: 'Chilly Paneer', price: 240, category: 'Oriental Starters' },
  { id: 'oveg5', name: 'Veg Spring Roll', price: 250, category: 'Oriental Starters' },
  { id: 'oveg6', name: 'Veg Hakka Noodles', price: 250, category: 'Oriental Starters' },
  { id: 'oveg7', name: 'Paneer Spring Roll', price: 260, category: 'Oriental Starters' },
  { id: 'oveg8', name: 'Paneer 65', price: 260, category: 'Oriental Starters' },
  { id: 'oveg9', name: 'Veg Schezwan Noodles', price: 260, category: 'Oriental Starters' },
  { id: 'oveg10', name: 'Chilly Garlic Noodles', price: 260, category: 'Oriental Starters' },
  { id: 'oveg11', name: 'Hot Garlic Paneer', price: 270, category: 'Oriental Starters' },
  { id: 'oveg12', name: 'Veg Fried Rice', price: 280, category: 'Oriental Starters' },
  { id: 'oveg13', name: 'Mix Schezwan Rice', price: 290, category: 'Oriental Starters' },
  { id: 'oveg14', name: 'Cocktail Rice', price: 300, category: 'Oriental Starters' },
  { id: 'oveg15', name: 'Paneer Fried Rice', price: 300, category: 'Oriental Starters' },
  
  // Oriental Non-Veg
  { id: 'onveg1', name: 'Egg Fried Rice', price: 260, category: 'Oriental Non-Veg' },
  { id: 'onveg2', name: 'Chicken Hakka Noodles', price: 280, category: 'Oriental Non-Veg' },
  { id: 'onveg3', name: 'Chilly Chicken', price: 300, category: 'Oriental Non-Veg' },
  { id: 'onveg4', name: 'Chicken 65', price: 300, category: 'Oriental Non-Veg' },
  { id: 'onveg5', name: 'Chicken Schezwan Noodles', price: 300, category: 'Oriental Non-Veg' },
  { id: 'onveg6', name: 'Chicken Garlic Noodles', price: 300, category: 'Oriental Non-Veg' },
  { id: 'onveg7', name: 'Chicken Fried Rice', price: 300, category: 'Oriental Non-Veg' },
  { id: 'onveg8', name: 'Dragon Chicken', price: 310, category: 'Oriental Non-Veg' },
  { id: 'onveg9', name: 'Lemon Chicken', price: 320, category: 'Oriental Non-Veg' },
  { id: 'onveg10', name: 'Chicken Cocktail Rice', price: 320, category: 'Oriental Non-Veg' },
  { id: 'onveg11', name: 'Chicken Black Paper', price: 330, category: 'Oriental Non-Veg' },
  { id: 'onveg12', name: 'Chicken Lollypop', price: 350, category: 'Oriental Non-Veg' },
  
  // Soups
  { id: 'sveg1', name: 'Cream of Tomato', price: 120, category: 'Soups' },
  { id: 'sveg2', name: 'Hot N Sour', price: 120, category: 'Soups' },
  { id: 'sveg3', name: 'Veg Manchow', price: 120, category: 'Soups' },
  { id: 'snveg1', name: 'Chicken Hot N Sour', price: 140, category: 'Soups' },
  { id: 'snveg2', name: 'Chicken Manchow', price: 140, category: 'Soups' },
  { id: 'snveg3', name: 'Chicken Clear', price: 140, category: 'Soups' },
  
  // Appetizers
  { id: 'aveg1', name: 'Fry/Rosted Papad', price: 25, category: 'Appetizers' },
  { id: 'aveg2', name: 'Masala Papad', price: 40, category: 'Appetizers' },
  { id: 'aveg3', name: 'French Fries', price: 120, category: 'Appetizers' },
  { id: 'aveg4', name: 'Honey Chilly Potato', price: 220, category: 'Appetizers' },
  { id: 'aveg5', name: 'Paneer Pakoda', price: 220, category: 'Appetizers' },
  { id: 'aveg6', name: 'Paneer Fingure', price: 220, category: 'Appetizers' },
  { id: 'anveg1', name: 'Egg Boil/Fry', price: 70, category: 'Appetizers' },
  { id: 'anveg2', name: 'Chicken Pakoda', price: 270, category: 'Appetizers' },
  { id: 'anveg3', name: 'Chicken Fingure', price: 300, category: 'Appetizers' },
  
  // Beverages
  { id: 'bev1', name: 'Mineral Water', price: 25, category: 'Beverages' },
  { id: 'bev2', name: 'Soda', price: 40, category: 'Beverages' },
  { id: 'bev3', name: 'Soft Drinks 750 ML', price: 55, category: 'Beverages' },
  { id: 'bev4', name: 'Fresh Lime Water', price: 60, category: 'Beverages' },
  { id: 'bev5', name: 'RedBull', price: 200, category: 'Beverages' },
  
  // Salad
  { id: 'sal1', name: 'Green Salad', price: 70, category: 'Salad' },
  { id: 'sal2', name: 'Kachumber Salad', price: 80, category: 'Salad' },
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
    total: 1240,
    items: [
      { itemId: 'ist1', name: 'Hara Bhara Kabab', price: 240, quantity: 1 },
      { itemId: 'mcnv11', name: 'Butter Chicken', price: 360, quantity: 2 },
      { itemId: 'bev3', name: 'Soft Drinks 750 ML', price: 55, quantity: 2 },
      { itemId: 'mcv13', name: 'Paneer Butter Masala', price: 300, quantity: 1 },
    ]
  },
  {
    id: 't2',
    billNumber: 'BILL-002',
    date: '2025-05-02T19:45:00',
    total: 1525,
    items: [
      { itemId: 'ist4', name: 'Bhuna Chicken', price: 300, quantity: 1 },
      { itemId: 'tnveg4', name: 'Chicken Garlic Tikka', price: 360, quantity: 2 },
      { itemId: 'aveg3', name: 'French Fries', price: 120, quantity: 2 },
      { itemId: 'bev4', name: 'Fresh Lime Water', price: 60, quantity: 2 },
    ]
  },
  {
    id: 't3',
    billNumber: 'BILL-003',
    date: '2025-05-02T20:15:00',
    total: 935,
    items: [
      { itemId: 'mcv4', name: 'Veg Kolhapuri', price: 230, quantity: 1 },
      { itemId: 'onveg6', name: 'Chicken Garlic Noodles', price: 300, quantity: 1 },
      { itemId: 'sveg2', name: 'Hot N Sour', price: 120, quantity: 1 },
      { itemId: 'bev3', name: 'Soft Drinks 750 ML', price: 55, quantity: 1 },
    ]
  },
  {
    id: 't4',
    billNumber: 'BILL-004',
    date: '2025-05-03T12:30:00',
    total: 1300,
    items: [
      { itemId: 'oveg3', name: 'Veg Manchurian', price: 230, quantity: 1 },
      { itemId: 'mcnv14', name: 'Mutton Roganjosh', price: 380, quantity: 1 },
      { itemId: 'sal1', name: 'Green Salad', price: 70, quantity: 1 },
      { itemId: 'bev5', name: 'RedBull', price: 200, quantity: 2 },
    ]
  },
];

// Restaurant details
export const restaurantInfo = {
  name: "The Base Four",
  address: "123 Fine Dining Street, Mumbai, India",
  phone: "+91 9876543210",
  email: "contact@thebasefour.com",
  website: "www.thebasefour.com"
};
