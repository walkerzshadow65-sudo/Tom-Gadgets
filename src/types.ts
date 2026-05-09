/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export const ADMIN_PASSWORD = "TomAbasiama2020@";
export const VERIFICATION_CODE = "482917";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    description: 'High-fidelity audio with active noise cancellation and 24-hour battery life.',
    price: 25000,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
    stock: 12,
  },
  {
    id: '2',
    name: 'Fast Charge Power Bank 20000mAh',
    description: 'Ultra-high capacity power bank with fast charging support for multiple devices.',
    price: 18500,
    category: 'Power',
    imageUrl: 'https://images.unsplash.com/photo-1609592424089-98904df86641?q=80&w=800&auto=format&fit=crop',
    stock: 4,
  },
  {
    id: '3',
    name: 'Smart LED Desk Lamp',
    description: 'Adjustable brightness and color temperature with built-in wireless charging pad.',
    price: 9800,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop',
    stock: 0,
  },
  {
    id: '4',
    name: 'Bluetooth Mechanical Keyboard',
    description: 'Tactile mechanical switches with RGB backlighting and multi-device connection.',
    price: 35000,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop',
    stock: 8,
  },
  {
    id: '5',
    name: '4K Webcam Ultra',
    description: 'Crystal clear 4K video for professional meetings and high-quality streaming.',
    price: 42000,
    category: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=800&auto=format&fit=crop',
    stock: 2,
  },
  {
    id: '6',
    name: 'USB-C Hub 7-in-1',
    description: 'Expand your laptop connectivity with HDMI, USB-A, and SD card slots.',
    price: 14500,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544654331-e1213cc0eb44?q=80&w=800&auto=format&fit=crop',
    stock: 20,
  },
];
