import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdQueryComponent } from './recd-query.component';
const routes: Routes = [{ path: '', component: RecdQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdQueryRoutingModule { }
