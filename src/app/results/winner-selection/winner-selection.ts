import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { BiddingService } from '../../services/bidding';
import { Product } from '../../models/product.model';
import { Bid } from '../../models/bid.model';

interface WinnerRecord {
  product: Product;
  winner: Bid | null;
  totalBids: number;
}

@Component({
  selector: 'app-winner-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './winner-selection.html',
  styleUrl: './winner-selection.css'
})
export class WinnerSelection implements OnInit, OnDestroy {

  records: WinnerRecord[] = [];
  private subscriptions = new Subscription();

  constructor(
    private sellerService: SellerService,
    private biddingService: BiddingService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.sellerService.products$.subscribe(() => this.loadWinners())
    );

    this.subscriptions.add(
      this.biddingService.bids$.subscribe(() => this.loadWinners())
    );
  }

  loadWinners(): void {
    const now = Date.now();

    const completedProducts = this.sellerService.getProducts()
      .filter(product => {
        const end = new Date(product.endDate).getTime();

        return product.status === 'approved' &&
          Number.isFinite(end) &&
          end <= now;
      });

    this.records = completedProducts.map(product => {
      const bids = this.biddingService.getBidsByProduct(product.id);

      const winner = bids.length
        ? bids.reduce((highest, current) =>
            current.bidAmount > highest.bidAmount ? current : highest
          )
        : null;

      return {
        product,
        winner,
        totalBids: bids.length
      };
    });
  }

  get selectedWinners(): number {
    return this.records.filter(record => record.winner !== null).length;
  }

  get noWinnerAuctions(): number {
    return this.records.filter(record => record.winner === null).length;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}