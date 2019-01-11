import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdVendorComponent } from './recd-vendor.component';
const routes: Routes = [{ path: '', component: RecdVendorComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdVendorRoutingModule { }
