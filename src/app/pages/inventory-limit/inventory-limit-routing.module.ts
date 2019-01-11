import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InventoryLimitComponent} from './inventory-limit.component';
const routes: Routes = [{ path: '', component: InventoryLimitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryLimitRoutingModule { }
