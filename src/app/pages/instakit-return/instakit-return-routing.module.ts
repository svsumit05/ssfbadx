import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InstakitReturnComponent} from './instakit-return.component';
const routes: Routes = [{ path: '', component: InstakitReturnComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstakitReturnRoutingModule { }
