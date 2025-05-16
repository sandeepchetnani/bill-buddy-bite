
export type TableBlock = 'A' | 'B' | 'C' | 'D' | 'E';
export type TableNumber = '1' | '2' | '3' | '4' | '5';

export interface Table {
  block: TableBlock;
  number: TableNumber;
  id: string;
  occupied: boolean;
  orderInProgress: boolean;
}

export interface WaiterUser {
  id: string;
  name: string;
  role: 'waiter';
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'admin';
}

export interface KitchenUser {
  id: string;
  name: string;
  role: 'kitchen';
}

export type User = WaiterUser | AdminUser | KitchenUser;
