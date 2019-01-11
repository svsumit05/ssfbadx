import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelviDistComponent } from './delvi-dist.component';
const routes: Routes = [{ path: '', component: DelviDistComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelviDistRoutingModule { }
