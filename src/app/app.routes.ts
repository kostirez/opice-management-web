import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customers/customer/customer-list.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ProvozComponent } from './components/provoz/provoz.component';
import { PlantingComponent } from './components/provoz/planting/planting.component';
import { TransferComponent } from './components/provoz/transfer/transfer.component';
import { HarvestComponent } from './components/provoz/harvest/harvest.component';
import { GrowingRoomComponent } from './components/growing-room/growing-room.component';
import { PackagingComponent } from './components/provoz/packaging/packaging.component';
import { DeliveryComponent } from './components/provoz/delivery/delivery.component';
import { CleaningComponent } from './components/provoz/cleaning/cleaning.component';
import { OperationPlanComponent } from './components/operation-plan/operation-plan.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard] },
  { path: 'customer/:id', component: CustomerDetailComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'order/:ducumentId', component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'growing-room', component: GrowingRoomComponent, canActivate: [authGuard] },
  { path: 'provoz', component: ProvozComponent, canActivate: [authGuard] },
  { path: 'provoz/planting', component: PlantingComponent, canActivate: [authGuard] },
  { path: 'provoz/transfer', component: TransferComponent, canActivate: [authGuard] },
  { path: 'provoz/harvest', component: HarvestComponent, canActivate: [authGuard] },
  { path: 'provoz/packaging', component: PackagingComponent, canActivate: [authGuard] },
  { path: 'provoz/delivery', component: DeliveryComponent, canActivate: [authGuard] },
  { path: 'provoz/cleaning', component: CleaningComponent, canActivate: [authGuard] },
  { path: 'operation-plan', component: OperationPlanComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/customers' }
];
