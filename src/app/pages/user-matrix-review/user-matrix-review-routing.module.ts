import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMatrixReviewComponent } from './user-matrix-review.component';
const routes: Routes = [{ path: '', component: UserMatrixReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMatrixReviewRoutingModule { }
