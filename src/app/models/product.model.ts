export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;

  name: string;
  description: string;
  category: string;

  startingPrice: number;
  currentBid: number;
  minIncrement: number;

  imageUrl: string;

  startDate: string;
  endDate: string;

  status: ProductStatus;
  createdAt: string;
}