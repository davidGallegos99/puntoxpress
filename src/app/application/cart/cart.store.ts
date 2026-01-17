import { computed, Injectable, signal } from '@angular/core';

import { CartItem } from '../../domain/models/cart-item';
import { Product } from '../../domain/models/product';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity * item.product.price, 0),
  );

  add(product: Product, quantity = 1): void {
    this.itemsSignal.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...items, { product, quantity }];
    });
  }

  remove(productId: string): void {
    this.itemsSignal.update((items) => items.filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    this.itemsSignal.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
