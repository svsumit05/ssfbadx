import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderReceivedComponent } from './order-received.component';
const routes: Routes = [{ path: '', component: OrderReceivedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReceivedRoutingModule { }
