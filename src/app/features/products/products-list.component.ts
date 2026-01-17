import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductsStore } from '../../application/products/products.store';
import { CartStore } from '../../application/cart/cart.store';

@Component({
  selector: 'px-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <h1>Explora productos recomendados</h1>
        <p>Catálogo curado con foco en productividad y bienestar.</p>
      </div>
      <label class="search">
        <span class="sr-only">Buscar productos</span>
        <input
          type="search"
          [value]="query()"
          (input)="onSearch($any($event.target).value)"
          placeholder="Buscar por nombre o categoría"
        />
      </label>
    </section>

    <section *ngIf="store.loading()" class="card">Cargando productos...</section>
    <section *ngIf="store.error()" class="card error">{{ store.error() }}</section>
    <section *ngIf="store.isEmpty()" class="card">No hay productos disponibles.</section>

    <section class="grid products" *ngIf="!store.loading() && !store.error()">
      <article class="card product" *ngFor="let product of filteredProducts()">
        <img [src]="product.imageUrl" [alt]="product.name" />
        <div class="product__content">
          <div class="product__header">
            <h3>{{ product.name }}</h3>
            <span class="badge">{{ product.category }}</span>
          </div>
          <p>{{ product.description }}</p>
          <div class="product__meta">
            <span class="price">{{ product.price | currency: 'USD' }}</span>
            <span class="rating">★ {{ product.rating }}</span>
          </div>
          <div class="product__actions">
            <a class="button secondary" [routerLink]="['/products', product.id]">
              Ver detalle
            </a>
            <button class="button" type="button" (click)="addToCart(product.id)">
              Agregar
            </button>
          </div>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .search input {
        border-radius: 999px;
        border: 1px solid var(--neutral-200);
        padding: 0.65rem 1rem;
        min-width: 260px;
      }

      .product {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .product__content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex: 1;
      }

      .product__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .product__meta {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        color: var(--neutral-700);
      }

      .product__actions {
        display: flex;
        gap: 0.75rem;
      }

      .price {
        font-size: 1.2rem;
        color: var(--primary);
      }

      .rating {
        color: var(--accent);
      }

      .error {
        color: #b91c1c;
        border-color: #fecaca;
        background: #fef2f2;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .search input {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  readonly store = inject(ProductsStore);
  private readonly cartStore = inject(CartStore);
  readonly query = signal('');

  readonly filteredProducts = computed(() => {
    const text = this.query().toLowerCase().trim();
    if (!text) {
      return this.store.products();
    }
    return this.store.products().filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(text),
    );
  });

  constructor() {
    void this.store.ensureLoaded();
  }

  onSearch(value: string): void {
    this.query.set(value);
  }

  addToCart(productId: string): void {
    const product = this.store.findById(productId);
    if (product) {
      this.cartStore.add(product, 1);
    }
  }
}
