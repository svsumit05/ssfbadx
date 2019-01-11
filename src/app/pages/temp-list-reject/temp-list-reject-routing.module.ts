import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TempListRejectComponent } from './temp-list-reject.component';
const routes: Routes = [{ path: '', component: TempListRejectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempListRoutingRejectModule { }
