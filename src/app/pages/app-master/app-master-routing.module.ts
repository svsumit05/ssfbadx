import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppMasterComponent } from './app-master.component';
const routes: Routes = [{ path: '', component: AppMasterComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppMasterRoutingModule { }
