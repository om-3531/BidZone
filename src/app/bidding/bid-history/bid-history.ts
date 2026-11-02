import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { BiddingService } from '../../services/bidding';
import { SellerService } from '../../services/seller.service';
import { Bid } from '../../models/bid.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-bid-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bid-history.html',
  styleUrl: './bid-history.css'
})
export class BidHistory implements OnInit, OnDestroy {

  product: Product | null = null;
  bids: Bid[] = [];

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private biddingService: BiddingService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) return;

    this.product = this.sellerService.getProductById(productId) ?? null;

    this.subscription = this.biddingService.bids$.subscribe(() => {
      this.bids = this.biddingService.getBidsByProduct(productId);
    });
  }

  get highestBid(): Bid | null {
    return this.bids.length > 0 ? this.bids[0] : null;
  }

  get totalBids(): number {
    return this.bids.length;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}