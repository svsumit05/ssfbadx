import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBrPropertyComponent } from './add-br-property.component';
const routes: Routes = [{ path: '', component: AddBrPropertyComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrPropertyRoutingModule { }
