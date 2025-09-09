export interface Product {
  _id?: string;        // MongoDB ObjectID (optional for new products)
  id: number;          // Custom ID
  name: string;        // Product name (max 50 chars)
  description: string; // Product description (max 255 chars)
  price: number;       // Product price (2 decimal places)
  units: number;       // Units in stock
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
  error?: string;
}
