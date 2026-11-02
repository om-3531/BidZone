export interface Bid {
  id: string;
  productId: string;
  bidderId: string;
  bidderName: string;
  bidAmount: number;
  bidTime: string;
}

export interface BidSubmission {
  productId: string;
  bidderId: string;
  bidderName: string;
  bidAmount: number;
}