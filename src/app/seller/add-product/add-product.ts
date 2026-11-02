import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SellerService } from '../../services/seller.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  product = {
    name: '',
    description: '',
    category: '',
    startingPrice: 0,
    minIncrement: 100,
    imageUrl: '',
    startDate: '',
    endDate: ''
  };

  message = '';
  errorMessage = '';

  constructor(
    private sellerService: SellerService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.message = '';
    this.errorMessage = '';

    if (new Date(this.product.endDate) <= new Date(this.product.startDate)) {
      this.errorMessage = 'Auction end date must be after start date.';
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      sellerId: 'seller-001',
sellerName: JSON.parse(
  localStorage.getItem('bidzone_seller_profile') || '{}'
).fullName || 'Demo Seller',
      name: this.product.name.trim(),
      description: this.product.description.trim(),
      category: this.product.category,
      startingPrice: Number(this.product.startingPrice),
      currentBid: Number(this.product.startingPrice),
      minIncrement: Number(this.product.minIncrement),
      imageUrl: this.product.imageUrl.trim(),
      startDate: this.product.startDate,
      endDate: this.product.endDate,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.sellerService.addProduct(newProduct);

    this.message = 'Product added successfully!';

    setTimeout(() => {
      this.router.navigate(['/seller/products']);
    }, 700);
  }
}