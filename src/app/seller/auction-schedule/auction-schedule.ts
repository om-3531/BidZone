import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-auction-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auction-schedule.html',
  styleUrl: './auction-schedule.css'
})
export class AuctionSchedule implements OnInit, OnDestroy {
  products: Product[] = [];
  selectedProduct: Product | null = null;

  successMessage = '';
  errorMessage = '';

  private subscription?: Subscription;

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.subscription = this.sellerService.products$.subscribe(products => {
      this.products = products.filter(
        product => product.sellerId === 'seller-001'
      );
    });
  }

  getStatus(product: Product): string {
    if (product.status !== 'approved') {
      return product.status === 'pending'
        ? 'Pending Approval'
        : 'Rejected';
    }

    const now = new Date().getTime();
    const start = new Date(product.startDate).getTime();
    const end = new Date(product.endDate).getTime();

    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Live';
    return 'Completed';
  }

  get approvedProducts(): Product[] {
    return this.products.filter(p => p.status === 'approved');
  }

  get upcomingCount(): number {
    return this.approvedProducts.filter(
      p => this.getStatus(p) === 'Upcoming'
    ).length;
  }

  get liveCount(): number {
    return this.approvedProducts.filter(
      p => this.getStatus(p) === 'Live'
    ).length;
  }

  get completedCount(): number {
    return this.approvedProducts.filter(
      p => this.getStatus(p) === 'Completed'
    ).length;
  }

  editSchedule(product: Product): void {
    if (product.status !== 'approved') {
      this.errorMessage = 'Only approved products can have their auction schedule managed here.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.selectedProduct = { ...product };
  }

  saveSchedule(): void {
    if (!this.selectedProduct) return;

    const start = new Date(this.selectedProduct.startDate).getTime();
    const end = new Date(this.selectedProduct.endDate).getTime();

    if (
      !this.selectedProduct.startDate ||
      !this.selectedProduct.endDate ||
      Number.isNaN(start) ||
      Number.isNaN(end)
    ) {
      this.errorMessage = 'Please select valid start and end dates.';
      return;
    }

    if (end <= start) {
      this.errorMessage = 'Auction end date must be after start date.';
      return;
    }

    this.sellerService.updateProduct(this.selectedProduct);

    this.successMessage = 'Auction schedule updated successfully!';
    this.selectedProduct = null;
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}