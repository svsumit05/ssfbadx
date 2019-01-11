import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorBillingComponent } from './vendor-billing.component';
const routes: Routes = [{ path: '', component: VendorBillingComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorBillingRoutingModule { }
