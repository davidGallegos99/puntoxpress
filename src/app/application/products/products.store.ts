import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Product } from '../../domain/models/product';
import { ProductRepository } from '../../domain/ports/product-repository';
import { ProductHttpRepository } from '../../data/repositories/product-repository.http';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly repository: ProductRepository = inject(ProductHttpRepository);
  private readonly state = signal<ProductsState>({
    items: [],
    loading: false,
    error: null,
    loaded: false,
  });

  readonly products = computed(() => this.state().items);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isEmpty = computed(() => !this.state().loading && this.state().items.length === 0);

  async ensureLoaded(): Promise<void> {
    if (this.state().loaded) {
      return;
    }
    await this.load();
  }

  async load(): Promise<void> {
    this.state.update((current) => ({ ...current, loading: true, error: null }));
    try {
      const items = await firstValueFrom(this.repository.getProducts());
      this.state.update(() => ({ items, loading: false, error: null, loaded: true }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado.';
      this.state.update(() => ({ items: [], loading: false, error: message, loaded: true }));
    }
  }

  findById(id: string): Product | null {
    return this.state().items.find((product) => product.id === id) ?? null;
  }
}
