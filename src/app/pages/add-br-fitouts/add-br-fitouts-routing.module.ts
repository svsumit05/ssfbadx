import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBrFitoutsComponent } from './add-br-fitouts.component';
const routes: Routes = [{ path: '', component: AddBrFitoutsComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrFitoutsRoutingModule { }
