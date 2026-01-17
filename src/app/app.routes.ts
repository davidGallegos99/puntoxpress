import { Routes } from '@angular/router';

import { ProductsListComponent } from './features/products/products-list.component';
import { ProductDetailComponent } from './features/products/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductsListComponent, title: 'Productos' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Detalle' },
  { path: 'cart', component: CartComponent, title: 'Carrito' },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
  { path: '**', redirectTo: 'products' },
];
