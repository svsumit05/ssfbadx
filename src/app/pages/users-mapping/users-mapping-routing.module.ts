import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersMappingComponent } from './users-mapping.component';
const routes: Routes = [{ path: '', component: UsersMappingComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersMappingRoutingModule { }
