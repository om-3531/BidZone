import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { BiddingService } from '../../services/bidding';

import { Product } from '../../models/product.model';
import { Bid } from '../../models/bid.model';

interface AuctionHistoryItem {
  product: Product;
  totalBids: number;
  highestBid: Bid | null;
}

@Component({
  selector: 'app-auction-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auction-history.html',
  styleUrl: './auction-history.css'
})
export class AuctionHistory implements OnInit, OnDestroy {

  history: AuctionHistoryItem[] = [];

  private subscriptions = new Subscription();

  constructor(
    private sellerService: SellerService,
    private biddingService: BiddingService
  ) {}

  ngOnInit(): void {

    this.subscriptions.add(
      this.sellerService.products$.subscribe(() => {
        this.loadHistory();
      })
    );

    this.subscriptions.add(
      this.biddingService.bids$.subscribe(() => {
        this.loadHistory();
      })
    );

  }

  loadHistory(): void {

    const now = Date.now();

    const completedProducts = this.sellerService
      .getProducts()
      .filter(product => {

        const endDate = new Date(product.endDate).getTime();

        return (
          product.status === 'approved' &&
          Number.isFinite(endDate) &&
          endDate < now
        );

      });

    this.history = completedProducts.map(product => {

      const bids = this.biddingService
        .getBidsByProduct(product.id);

      return {
        product: product,
        totalBids: bids.length,
        highestBid: bids.length > 0 ? bids[0] : null
      };

    });

    this.history.sort((a, b) =>
      new Date(b.product.endDate).getTime() -
      new Date(a.product.endDate).getTime()
    );

  }

  get totalAuctions(): number {
    return this.history.length;
  }

  get auctionsWithBids(): number {
    return this.history.filter(item => item.totalBids > 0).length;
  }

  get auctionsWithoutBids(): number {
    return this.history.filter(item => item.totalBids === 0).length;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}