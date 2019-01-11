import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InventoryMasterComponent} from './inventory-master.component';
const routes: Routes = [{ path: '', component: InventoryMasterComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryMasterRoutingModule { }
