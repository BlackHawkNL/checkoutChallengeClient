import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component'
import { ProductsComponent } from './products/products.component'
import { SuccessComponent } from './success/success.component'
import { PendingComponent } from './pending/pending.component'
import { FailedComponent } from './failed/failed.component'
import { ErrorComponent } from './error/error.component'
import { DashboardComponent } from './dashboard/dashboard.component'


const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'failed', component: FailedComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'dash', component: DashboardComponent },
  { path: '', redirectTo: '/checkout', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
