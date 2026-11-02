import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css'
})
export class SellerDashboard implements OnInit {

  products: Product[] = [];

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.products = this.sellerService.getProducts();
    this.sellerService.products$.subscribe(data => {
      this.products = data;
    });
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get pendingProducts(): number {
    return this.products.filter(p => p.status === 'pending').length;
  }

  get approvedProducts(): number {
    return this.products.filter(p => p.status === 'approved').length;
  }

  get rejectedProducts(): number {
    return this.products.filter(p => p.status === 'rejected').length;
  }
}