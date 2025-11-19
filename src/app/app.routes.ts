import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customers/customer/customer-list.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { BatchListComponent } from './components/batches/batch-list.component';
import { ActionListComponent } from './components/actions/action-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { BatchDetailComponent } from './components/batches/batch-detail/batch-detail.component';
import { ActionDetailComponent } from './components/actions/action-detail/action-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customer/:id', component: CustomerDetailComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'order/:ducumentId', component: OrderDetailComponent },
  { path: 'batches', component: BatchListComponent },
  { path: 'batch/:ducumentId', component: BatchDetailComponent },
  { path: 'actions', component: ActionListComponent },
  { path: 'action/:ducumentId', component: ActionDetailComponent },
  { path: '**', redirectTo: '/customers' }
];
