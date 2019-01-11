import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminInventoryComponent } from './admin-inventory.component';
const routes: Routes = [{ path: '', component: AdminInventoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryRoutingModule { }
