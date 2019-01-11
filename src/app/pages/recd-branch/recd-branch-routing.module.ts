import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdBranchComponent } from './recd-branch.component';
const routes: Routes = [{ path: '', component: RecdBranchComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdBranchRoutingModule { }
