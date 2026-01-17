import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartStore } from '../../application/cart/cart.store';

@Component({
  selector: 'px-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <h1>Checkout</h1>
        <p>Completa tus datos para finalizar la compra.</p>
      </div>
    </section>

    <section class="grid checkout">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-field">
          <label for="name">Nombre completo</label>
          <input id="name" type="text" formControlName="name" />
          <span class="error" *ngIf="isInvalid('name')">Ingresa tu nombre.</span>
        </div>
        <div class="form-field">
          <label for="email">Correo</label>
          <input id="email" type="email" formControlName="email" />
          <span class="error" *ngIf="isInvalid('email')">Correo inválido.</span>
        </div>
        <div class="form-field">
          <label for="address">Dirección</label>
          <input id="address" type="text" formControlName="address" />
          <span class="error" *ngIf="isInvalid('address')">Ingresa tu dirección.</span>
        </div>
        <div class="form-field">
          <label for="notes">Notas para el envío</label>
          <textarea id="notes" rows="3" formControlName="notes"></textarea>
        </div>
        <button class="button" type="submit" [disabled]="form.invalid || items().length === 0">
          Confirmar pedido
        </button>
        <p class="success" *ngIf="orderPlaced()">
          Pedido confirmado. Te enviamos un resumen al correo.
        </p>
      </form>

      <aside class="card summary">
        <h2>Resumen</h2>
        <div *ngIf="items().length === 0">No hay productos en el carrito.</div>
        <div class="summary-item" *ngFor="let item of items()">
          <span>{{ item.product.name }} x{{ item.quantity }}</span>
          <span>{{ item.product.price * item.quantity | currency: 'USD' }}</span>
        </div>
        <div class="summary-total">
          <span>Total</span>
          <span>{{ totalPrice() | currency: 'USD' }}</span>
        </div>
        <a class="button secondary" routerLink="/cart">Volver al carrito</a>
      </aside>
    </section>
  `,
  styles: [
    `
      .checkout {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        align-items: start;
        gap: 2rem;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      input,
      textarea {
        padding: 0.6rem 0.8rem;
        border-radius: 12px;
        border: 1px solid var(--neutral-200);
        font-family: inherit;
      }

      .error {
        color: #b91c1c;
        font-size: 0.85rem;
      }

      .success {
        color: #15803d;
        font-weight: 600;
      }

      .summary {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .summary-item,
      .summary-total {
        display: flex;
        justify-content: space-between;
      }

      .summary-total {
        font-size: 1.2rem;
        font-weight: 700;
      }

      @media (max-width: 960px) {
        .checkout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  private readonly cartStore = inject(CartStore);
  private readonly fb = inject(FormBuilder);
  readonly orderPlaced = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    notes: [''],
  });

  readonly items = computed(() => this.cartStore.items());
  readonly totalPrice = computed(() => this.cartStore.totalPrice());

  submit(): void {
    if (this.form.invalid || this.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.orderPlaced.set(true);
    this.cartStore.clear();
    this.form.reset();
  }

  isInvalid(controlName: 'name' | 'email' | 'address'): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
