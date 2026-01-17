import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CartStore } from '../application/cart/cart.store';

@Component({
  selector: 'px-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="container app-header__content">
        <div>
          <p class="app-brand">Puntoxpress</p>
          <span class="app-subtitle">Mini e-commerce UI/UX</span>
        </div>
        <nav class="app-nav">
          <a routerLink="/products" routerLinkActive="active">Productos</a>
          <a routerLink="/cart" routerLinkActive="active">
            Carrito
            <span class="badge" *ngIf="cartCount()">{{ cartCount() }}</span>
          </a>
          <a routerLink="/checkout" routerLinkActive="active">Checkout</a>
        </nav>
      </div>
    </header>
    <main class="container page">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .app-header {
        background: white;
        border-bottom: 1px solid var(--neutral-200);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .app-header__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 0;
        gap: 1.5rem;
      }

      .app-brand {
        font-size: 1.4rem;
        margin: 0;
        font-weight: 700;
      }

      .app-subtitle {
        color: var(--neutral-500);
        font-size: 0.9rem;
      }

      .app-nav {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        font-weight: 600;
      }

      .app-nav a.active {
        color: var(--primary);
      }

      @media (max-width: 720px) {
        .app-header__content {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly cartStore = inject(CartStore);

  readonly cartCount = computed(() => this.cartStore.totalItems());
}
