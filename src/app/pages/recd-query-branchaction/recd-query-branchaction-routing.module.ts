import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdQueryBranchactionComponent } from './recd-query-branchaction.component';
const routes: Routes = [{ path: '', component: RecdQueryBranchactionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdQueryBranchactionRoutingModule { }
