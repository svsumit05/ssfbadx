import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TempListApprovedComponent } from './temp-list-approved.component';
const routes: Routes = [{ path: '', component: TempListApprovedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempListRoutingApprovedModule { }
