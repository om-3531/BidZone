import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface SellerProfileData {
  sellerId: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
}

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './seller-profile.html',
  styleUrl: './seller-profile.css'
})
export class SellerProfile implements OnInit {
  private readonly storageKey = 'bidzone_seller_profile';

  profile: SellerProfileData = {
    sellerId: 'seller-001',
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: ''
  };

  successMessage = '';

  ngOnInit(): void {
    const savedProfile = localStorage.getItem(this.storageKey);

    if (savedProfile) {
      this.profile = {
        ...this.profile,
        ...JSON.parse(savedProfile)
      };
    }
  }

  saveProfile(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.profile));

    this.successMessage = 'Seller profile updated successfully!';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}