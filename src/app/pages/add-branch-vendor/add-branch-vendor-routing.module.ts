import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBranchVendorComponent } from './add-branch-vendor.component';
const routes: Routes = [{ path: '', component: AddBranchVendorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBranchVendorRoutingModule { }
