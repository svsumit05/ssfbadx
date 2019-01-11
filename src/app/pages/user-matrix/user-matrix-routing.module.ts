import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMatrixComponent } from './user-matrix.component';
const routes: Routes = [{ path: '', component: UserMatrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMatrixRoutingModule { }
