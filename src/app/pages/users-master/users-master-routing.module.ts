import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersMasterComponent } from './users-master.component';
const routes: Routes = [{ path: '', component: UsersMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersMasterRoutingModule { }
