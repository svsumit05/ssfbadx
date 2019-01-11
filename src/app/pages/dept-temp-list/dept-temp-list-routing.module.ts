import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeptTempListComponent } from './dept-temp-list.component';
const routes: Routes = [{ path: '', component: DeptTempListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeptTempListRoutingModule { }
