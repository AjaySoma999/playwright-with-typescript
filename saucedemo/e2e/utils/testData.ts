import users from '../test/data/users.json';
import checkoutData from '../test/data/checkout.json';
import inventoryData from '../test/data/inventory.json';
import checkoutEdgeCasesData from '../test/data/checkout-edge-cases.json';

export type UserData = {
  username: string;
  password: string;
  expectSuccess: boolean;
};

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedError?: string;
};

export type CheckoutData = {
  customerInfo: CustomerInfo[];
  cartItems: string[];
};

export type InventoryItem = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type CheckoutEdgeCases = {
  customerInfo: CustomerInfo[];
  cartVariants: Array<{ items: string[]; expectedError?: string; expectedTotal?: number }>;
};

export function getUsers(): UserData[] {
  return users as UserData[];
}

export function getValidUsers(): string[] {
  return getUsers().filter((u) => u.expectSuccess).map((u) => u.username);
}

export function getUserByUsername(username: string): UserData | undefined {
  return getUsers().find((u) => u.username === username);
}

export function getNonVisualUsers(): UserData[] {
  return getUsers().filter((u) => u.username !== 'visual_user');
}

export function getLockedOutUsers(): UserData[] {
  return getUsers().filter((u) => !u.expectSuccess);
}

export function getCheckoutData(): CheckoutData {
  return checkoutData as CheckoutData;
}

export function getInventoryData(): InventoryItem[] {
  return inventoryData.items as InventoryItem[];
}

export function getCheckoutEdgeCasesData(): CheckoutEdgeCases {
  return checkoutEdgeCasesData as CheckoutEdgeCases;
}
