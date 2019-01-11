import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdQueryBranchComponent } from './recd-query-branch.component';
const routes: Routes = [{ path: '', component: RecdQueryBranchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdQueryBranchRoutingModule { }
