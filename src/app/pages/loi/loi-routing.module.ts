import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoiComponent } from './loi.component';
const routes: Routes = [{ path: '', component: LoiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoiRoutingModule { }
