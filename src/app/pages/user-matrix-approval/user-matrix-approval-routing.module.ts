import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMatrixApprovalComponent } from './user-matrix-approval.component';
const routes: Routes = [{ path: '', component: UserMatrixApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMatrixApprovalRoutingModule { }
