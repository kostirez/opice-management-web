import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customers/customer/customer-list.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { BatchListComponent } from './components/batches/batch-list/batch-list.component';
import { ActionListComponent } from './components/actions/action-list/action-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { BatchDetailComponent } from './components/batches/batch-detail/batch-detail.component';
import { ActionDetailComponent } from './components/actions/action-detail/action-detail.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard] },
  { path: 'customer/:id', component: CustomerDetailComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'order/:ducumentId', component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'batches', component: BatchListComponent, canActivate: [authGuard] },
  { path: 'batch/:ducumentId', component: BatchDetailComponent, canActivate: [authGuard] },
  { path: 'actions', component: ActionListComponent, canActivate: [authGuard] },
  { path: 'action/:ducumentId', component: ActionDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/customers' }
];
