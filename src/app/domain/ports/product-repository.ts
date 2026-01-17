import { Observable } from 'rxjs';
import { Product } from '../models/product';

export interface ProductRepository {
  getProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product | null>;
}
