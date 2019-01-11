import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersReportComponent } from './users-report.component';
const routes: Routes = [{ path: '', component: UsersReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersReportRoutingModule { }
