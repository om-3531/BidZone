
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SellerService } from '../../services/seller.service';
import { BiddingService } from '../../services/bidding';

type PaymentStatusType = 'Paid' | 'Pending' | 'Failed';

interface Payment {
  id: string;
  productId: string;
  productName: string;
  winnerName: string;
  amount: number;
  date: string;
  status: PaymentStatusType;
}

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-status.html',
  styleUrl: './payment-status.css'
})
export class PaymentStatus implements OnInit, OnDestroy {

  private readonly storageKey = 'bidzone_payments';

  payments: Payment[] = [];

  private subscriptions = new Subscription();

  constructor(
    private sellerService: SellerService,
    private biddingService: BiddingService
  ) {}

  ngOnInit(): void {
    this.loadPayments();

    this.subscriptions.add(
      this.sellerService.products$.subscribe(() => {
        this.syncPayments();
      })
    );

    this.subscriptions.add(
      this.biddingService.bids$.subscribe(() => {
        this.syncPayments();
      })
    );
  }

  private loadPayments(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.payments = saved ? JSON.parse(saved) : [];
    } catch {
      this.payments = [];
    }
  }

  private savePayments(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.payments)
    );
  }

  private syncPayments(): void {

    const now = Date.now();

    const completedProducts = this.sellerService.getProducts()
      .filter(product => {
        const end = new Date(product.endDate).getTime();

        return product.status === 'approved' &&
          Number.isFinite(end) &&
          end <= now;
      });

    const updatedPayments: Payment[] = [];

    for (const product of completedProducts) {

      const bids = this.biddingService.getBidsByProduct(product.id);

      if (bids.length === 0) {
        continue;
      }

      // Highest bidder becomes winner.
      const winner = bids.reduce((highest, current) =>
        current.bidAmount > highest.bidAmount ? current : highest
      );

      // Preserve existing payment status.
      const existingPayment = this.payments.find(
        payment => payment.productId === product.id
      );

      updatedPayments.push({
        id: existingPayment?.id || `PAY-${product.id}`,
        productId: product.id,
        productName: product.name,
        winnerName: winner.bidderName,
        amount: winner.bidAmount,
        date: product.endDate,
        status: existingPayment?.status || 'Pending'
      });
    }

    this.payments = updatedPayments;
    this.savePayments();
  }

  get totalPayments(): number {
    return this.payments.length;
  }

  get paidPayments(): number {
    return this.payments.filter(p => p.status === 'Paid').length;
  }

  get pendingPayments(): number {
    return this.payments.filter(p => p.status === 'Pending').length;
  }

  get failedPayments(): number {
    return this.payments.filter(p => p.status === 'Failed').length;
  }

  get totalAmount(): number {
    return this.payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  updateStatus(id: string, status: PaymentStatusType): void {
    this.payments = this.payments.map(payment =>
      payment.id === id
        ? { ...payment, status }
        : payment
    );

    this.savePayments();
  }

  markAsPaid(id: string): void {
    this.updateStatus(id, 'Paid');
  }

  markAsFailed(id: string): void {
    this.updateStatus(id, 'Failed');
  }

  resetDemo(): void {
    // Reset all existing payments to Pending.
    this.payments = this.payments.map(payment => ({
      ...payment,
      status: 'Pending'
    }));

    this.savePayments();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
