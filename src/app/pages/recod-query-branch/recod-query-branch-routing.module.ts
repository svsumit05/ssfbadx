import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecodQueryBranchComponent } from './recod-query-branch.component';
const routes: Routes = [{ path: '', component: RecodQueryBranchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecodQueryBranchRoutingModule { }
