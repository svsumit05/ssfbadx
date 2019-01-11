import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderVisitingcardComponent } from './order-visitingcard.component';
const routes: Routes = [{ path: '', component: OrderVisitingcardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderVisitingcardRoutingModule { }
