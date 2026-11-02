import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private storageKey = 'bidzone_products';

  private productsSubject = new BehaviorSubject<Product[]>(
    this.loadProducts()
  );

  products$ = this.productsSubject.asObservable();

  private loadProducts(): Product[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) as Product[] : [];
    } catch {
      return [];
    }
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(product => product.id === id);
  }

  getProductsBySeller(sellerId: string): Product[] {
    return this.getProducts().filter(
      product => product.sellerId === sellerId
    );
  }

  addProduct(product: Product): void {
    const products = [...this.getProducts(), product];
    this.saveProducts(products);
  }

  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts().map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );

    this.saveProducts(products);
  }

  updateProductStatus(id: string, status: ProductStatus): void {
    const products = this.getProducts().map(product =>
      product.id === id ? { ...product, status } : product
    );

    this.saveProducts(products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(
      product => product.id !== id
    );

    this.saveProducts(products);
  }
}