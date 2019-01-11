import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecodVendorComponent } from './recod-vendor.component';
const routes: Routes = [{ path: '', component: RecodVendorComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecodVendorRoutingModule { }
