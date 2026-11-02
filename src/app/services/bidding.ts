import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Bid, BidSubmission } from '../models/bid.model';
import { SellerService } from './seller.service';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {

  private readonly storageKey = 'bidzone_bids';

  private bidsSubject = new BehaviorSubject<Bid[]>(this.loadBids());

  bids$ = this.bidsSubject.asObservable();

  constructor(private sellerService: SellerService) {}

  private loadBids(): Bid[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveBids(bids: Bid[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(bids));
    this.bidsSubject.next(bids);
  }

  getBids(): Bid[] {
    return this.bidsSubject.value;
  }

  getBidsByProduct(productId: string): Bid[] {
    return this.getBids()
      .filter(bid => bid.productId === productId)
      .sort((a, b) => b.bidAmount - a.bidAmount);
  }

  placeBid(submission: BidSubmission): {
    success: boolean;
    message: string;
  } {
    const product = this.sellerService.getProductById(
      submission.productId
    );

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    if (product.status !== 'approved') {
      return { success: false, message: 'Product is not approved.' };
    }

    const now = Date.now();
    const start = new Date(product.startDate).getTime();
    const end = new Date(product.endDate).getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return { success: false, message: 'Invalid auction schedule.' };
    }

    if (now < start) {
      return { success: false, message: 'Auction has not started yet.' };
    }

    if (now > end) {
      return { success: false, message: 'Auction has ended.' };
    }

    const minimumBid = product.currentBid + product.minIncrement;

    if (
      !Number.isFinite(submission.bidAmount) ||
      submission.bidAmount < minimumBid
    ) {
      return {
        success: false,
        message: `Minimum bid is ₹${minimumBid}.`
      };
    }

    const newBid: Bid = {
      id: Date.now().toString(),
      productId: submission.productId,
      bidderId: submission.bidderId,
      bidderName: submission.bidderName,
      bidAmount: submission.bidAmount,
      bidTime: new Date().toISOString()
    };

    this.sellerService.updateProduct({
      ...product,
      currentBid: submission.bidAmount
    });

    this.saveBids([...this.getBids(), newBid]);

    return {
      success: true,
      message: 'Your bid was placed successfully!'
    };
  }
}