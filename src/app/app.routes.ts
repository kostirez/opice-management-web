import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customers/customer/customer-list.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { BatchListComponent } from './components/batches/batch-list.component';
import { ActionListComponent } from './components/actions/action-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customer/:id', component: CustomerDetailComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'batches', component: BatchListComponent },
  { path: 'actions', component: ActionListComponent },
  { path: '**', redirectTo: '/customers' }
];
