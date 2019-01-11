import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBranchDetailsComponent } from './add-branch-details.component';
const routes: Routes = [{ path: '', component: AddBranchDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBranchDetailsRoutingModule { }
