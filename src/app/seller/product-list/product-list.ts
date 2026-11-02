import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  products: Product[] = [];
  searchText = '';
  selectedStatus = 'all';

  private subscription?: Subscription;

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.subscription = this.sellerService.products$.subscribe(products => {
      this.products = products.filter(
        product => product.sellerId === 'seller-001'
      );
    });
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'all' ||
        product.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get pendingCount(): number {
    return this.products.filter(p => p.status === 'pending').length;
  }

  get approvedCount(): number {
    return this.products.filter(p => p.status === 'approved').length;
  }

  get rejectedCount(): number {
    return this.products.filter(p => p.status === 'rejected').length;
  }

  deleteProduct(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this product?');

    if (confirmed) {
      this.sellerService.deleteProduct(id);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}