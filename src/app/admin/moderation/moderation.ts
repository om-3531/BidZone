
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

interface ModerationProduct {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  image: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string;
}

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderation.html',
  styleUrl: './moderation.css'
})
export class Moderation implements OnInit, OnDestroy {

  searchText = '';
  selectedCategory = 'All';
  selectedStatus = 'All';

  selectedProduct: ModerationProduct | null = null;
  products: ModerationProduct[] = [];

  private subscription?: Subscription;

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.subscription = this.sellerService.products$.subscribe(
      (data: Product[]) => {
        this.products = data.map(product => ({
          id: product.id,
          name: product.name,
          seller: product.sellerName,
          category: product.category,
          price: product.startingPrice,
          image: product.imageUrl,
          status: this.formatStatus(product.status),
          description: product.description
        }));
      }
    );
  }

  private formatStatus(
    status: Product['status']
  ): ModerationProduct['status'] {
    return status.charAt(0).toUpperCase() + status.slice(1) as
      ModerationProduct['status'];
  }

  get pendingCount(): number {
    return this.products.filter(p => p.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.products.filter(p => p.status === 'Approved').length;
  }

  get rejectedCount(): number {
    return this.products.filter(p => p.status === 'Rejected').length;
  }

  get filteredProducts(): ModerationProduct[] {
    return this.products.filter(product => {
      const search = this.searchText.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.seller.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        product.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  approveProduct(product: ModerationProduct): void {
    this.sellerService.updateProductStatus(product.id, 'approved');
    this.selectedProduct = null;
  }

  rejectProduct(product: ModerationProduct): void {
    this.sellerService.updateProductStatus(product.id, 'rejected');
    this.selectedProduct = null;
  }

  viewProduct(product: ModerationProduct): void {
    this.selectedProduct = product;
  }

  closeDetails(): void {
    this.selectedProduct = null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
