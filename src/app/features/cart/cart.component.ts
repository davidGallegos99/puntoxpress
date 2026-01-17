import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartStore } from '../../application/cart/cart.store';

@Component({
  selector: 'px-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <h1>Carrito</h1>
        <p>Revisa tus productos y ajusta cantidades antes de pagar.</p>
      </div>
      <a class="button secondary" routerLink="/products">Seguir comprando</a>
    </section>

    <section *ngIf="items().length === 0" class="card">Tu carrito está vacío.</section>

    <section class="grid cart" *ngIf="items().length">
      <div class="card cart__items">
        <article class="cart-item" *ngFor="let item of items()">
          <img [src]="item.product.imageUrl" [alt]="item.product.name" />
          <div class="cart-item__content">
            <h3>{{ item.product.name }}</h3>
            <p>{{ item.product.description }}</p>
            <div class="cart-item__meta">
              <span class="price">{{ item.product.price | currency: 'USD' }}</span>
              <label class="quantity">
                Cantidad
                <input
                  type="number"
                  min="1"
                  [value]="item.quantity"
                  (input)="updateQuantity(item.product.id, $any($event.target).value)"
                />
              </label>
            </div>
          </div>
          <button class="button secondary" type="button" (click)="remove(item.product.id)">
            Quitar
          </button>
        </article>
      </div>

      <aside class="card cart__summary">
        <h2>Resumen</h2>
        <div class="summary-row">
          <span>Artículos</span>
          <span>{{ totalItems() }}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ totalPrice() | currency: 'USD' }}</span>
        </div>
        <a class="button" routerLink="/checkout">Ir a checkout</a>
      </aside>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .cart {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        align-items: start;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 100px 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid var(--neutral-200);
      }

      .cart-item:last-child {
        border-bottom: none;
      }

      .cart-item__content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .cart-item__meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .quantity {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: var(--neutral-700);
      }

      .quantity input {
        width: 90px;
        padding: 0.4rem;
        border-radius: 10px;
        border: 1px solid var(--neutral-200);
      }

      .price {
        font-weight: 600;
        color: var(--primary);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }

      .summary-row.total {
        font-size: 1.2rem;
        font-weight: 700;
      }

      .cart__summary {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      @media (max-width: 960px) {
        .cart {
          grid-template-columns: 1fr;
        }

        .cart-item {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly cartStore = inject(CartStore);

  readonly items = computed(() => this.cartStore.items());
  readonly totalItems = computed(() => this.cartStore.totalItems());
  readonly totalPrice = computed(() => this.cartStore.totalPrice());

  updateQuantity(productId: string, value: string): void {
    const quantity = Number(value);
    if (!Number.isNaN(quantity)) {
      this.cartStore.updateQuantity(productId, quantity);
    }
  }

  remove(productId: string): void {
    this.cartStore.remove(productId);
  }
}
