import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { BiddingService } from '../../services/bidding';

import { Product } from '../../models/product.model';
import { Bid } from '../../models/bid.model';

@Component({
  selector: 'app-auction-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auction-details.html',
  styleUrl: './auction-details.css'
})
export class AuctionDetails implements OnInit, OnDestroy {
  product: Product | null = null;
  bids: Bid[] = [];

  bidAmount: number | null = null;
  bidderName = '';
  bidderId = 'buyer-001';

  countdown = '00d 00h 00m 00s';
  auctionState = 'Loading...';

  message = '';
  messageType: 'success' | 'error' = 'success';

  private timerSubscription?: Subscription;
  private bidsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private biddingService: BiddingService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.auctionState = 'Product not found';
      return;
    }

    this.product = this.sellerService.getProductById(productId) ?? null;

    if (!this.product || this.product.status !== 'approved') {
      this.product = null;
      this.auctionState = 'This auction is not available.';
      return;
    }

    this.bidAmount = this.product.currentBid + this.product.minIncrement;

    this.bidsSubscription = this.biddingService.bids$.subscribe(() => {
      this.bids = this.biddingService.getBidsByProduct(productId);
    });

    this.updateCountdown();

    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();

      // Refresh current bid if another action updates the product.
      const updated = this.sellerService.getProductById(productId);
      if (updated) {
        this.product = updated;
      }
    });
  }

  updateCountdown(): void {
    if (!this.product) return;

    const now = Date.now();
    const start = new Date(this.product.startDate).getTime();
    const end = new Date(this.product.endDate).getTime();

    if (now < start) {
      this.auctionState = 'Upcoming';
      this.countdown = this.formatTime(start - now);
    } else if (now <= end) {
      this.auctionState = 'Live Now';
      this.countdown = this.formatTime(end - now);
    } else {
      this.auctionState = 'Auction Completed';
      this.countdown = '00d 00h 00m 00s';
    }
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  placeBid(): void {
    if (!this.product || !this.bidAmount) return;

    if (!this.bidderName.trim()) {
      this.showMessage('Please enter your name.', 'error');
      return;
    }

    const result = this.biddingService.placeBid({
      productId: this.product.id,
      bidderId: this.bidderId,
      bidderName: this.bidderName.trim(),
      bidAmount: Number(this.bidAmount)
    });

    this.showMessage(
      result.message,
      result.success ? 'success' : 'error'
    );

    if (result.success) {
      this.product = this.sellerService.getProductById(this.product.id) ?? this.product;
      this.bidAmount = this.product.currentBid + this.product.minIncrement;
    }
  }

  private showMessage(
    message: string,
    type: 'success' | 'error'
  ): void {
    this.message = message;
    this.messageType = type;
  }

  get minimumBid(): number {
    if (!this.product) return 0;

    return this.product.currentBid + this.product.minIncrement;
  }

  get canPlaceBid(): boolean {
    return this.auctionState === 'Live Now';
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.bidsSubscription?.unsubscribe();
  }
}