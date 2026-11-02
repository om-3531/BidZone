import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  product: Product | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/seller/products']);
      return;
    }

    this.product = this.sellerService.getProductById(id) ?? null;

    if (!this.product || this.product.sellerId !== 'seller-001') {
      this.router.navigate(['/seller/products']);
    }
  }

  saveChanges(): void {
    if (!this.product) return;

    this.errorMessage = '';

    if (new Date(this.product.endDate) <= new Date(this.product.startDate)) {
      this.errorMessage = 'Auction end date must be after start date.';
      return;
    }

    if (this.product.startingPrice <= 0 || this.product.minIncrement <= 0) {
      this.errorMessage = 'Prices must be greater than zero.';
      return;
    }

    this.sellerService.updateProduct(this.product);

    alert('Product updated successfully!');
    this.router.navigate(['/seller/products']);
  }

  cancel(): void {
    this.router.navigate(['/seller/products']);
  }
}