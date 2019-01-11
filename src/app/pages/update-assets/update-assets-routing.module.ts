import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateAssetsComponent } from './update-assets.component';
const routes: Routes = [{ path: '', component: UpdateAssetsComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateAssetsRoutingModule { }
