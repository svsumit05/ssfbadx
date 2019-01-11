import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAssetsComponent } from './add-assets.component';
const routes: Routes = [{ path: '', component: AddAssetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAssetsRoutingModule { }
