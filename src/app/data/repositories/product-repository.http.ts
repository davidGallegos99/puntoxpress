import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ProductRepository } from '../../domain/ports/product-repository';
import { Product } from '../../domain/models/product';

@Injectable({ providedIn: 'root' })
export class ProductHttpRepository implements ProductRepository {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/assets/products.json');
  }

  getProductById(id: string): Observable<Product | null> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id) ?? null),
    );
  }
}
