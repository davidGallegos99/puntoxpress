import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ProductsStore } from '../../application/products/products.store';
import { CartStore } from '../../application/cart/cart.store';

@Component({
  selector: 'px-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section *ngIf="product() as item" class="grid detail">
      <div class="card">
        <img [src]="item.imageUrl" [alt]="item.name" />
      </div>
      <div class="card detail__content">
        <span class="badge">{{ item.category }}</span>
        <h1>{{ item.name }}</h1>
        <p>{{ item.description }}</p>
        <ul>
          <li *ngFor="let feature of item.features">{{ feature }}</li>
        </ul>
        <div class="detail__meta">
          <span class="price">{{ item.price | currency: 'USD' }}</span>
          <span class="rating">★ {{ item.rating }}</span>
        </div>
        <div class="detail__actions">
          <button class="button" type="button" (click)="addToCart(item.id)">
            Agregar al carrito
          </button>
          <a class="button secondary" routerLink="/products">Volver</a>
        </div>
      </div>
    </section>

    <section *ngIf="!product() && !store.loading()" class="card">
      Producto no encontrado.
    </section>
  `,
  styles: [
    `
      .detail {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        align-items: start;
      }

      .detail__content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .detail__meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      .detail__actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .price {
        font-size: 1.5rem;
        color: var(--primary);
      }

      .rating {
        color: var(--accent);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  readonly store = inject(ProductsStore);
  private readonly cartStore = inject(CartStore);
  private readonly route = inject(ActivatedRoute);

  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly product = computed(() => {
    const id = this.routeId();
    return id ? this.store.findById(id) : null;
  });

  constructor() {
    void this.store.ensureLoaded();
  }

  addToCart(productId: string): void {
    const product = this.store.findById(productId);
    if (product) {
      this.cartStore.add(product, 1);
    }
  }
}
