import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderInventoryComponent } from './order-inventory.component';
const routes: Routes = [{ path: '', component: OrderInventoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderInventoryRoutingModule { }
