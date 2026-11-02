import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-live-auctions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './live-auctions.html',
  styleUrl: './live-auctions.css'
})
export class LiveAuctions implements OnInit, OnDestroy {

  products: Product[] = [];
  private subscription?: Subscription;

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
  this.subscription = this.sellerService.products$.subscribe(products => {
    const now = Date.now();

    console.log('ALL PRODUCTS:', products);
    console.log('CURRENT TIME:', new Date(now));

    products.forEach(product => {
      console.log('PRODUCT:', product.name);
      console.log('STATUS:', product.status);
      console.log('START:', product.startDate);
      console.log('END:', product.endDate);
      console.log('START TIME:', new Date(product.startDate));
      console.log('END TIME:', new Date(product.endDate));
    });

    this.products = products.filter(product => {
      const start = new Date(product.startDate).getTime();
      const end = new Date(product.endDate).getTime();

      return product.status === 'approved' &&
             start <= now &&
             end > now;
    });

    console.log('LIVE AUCTIONS:', this.products);
  });
}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}