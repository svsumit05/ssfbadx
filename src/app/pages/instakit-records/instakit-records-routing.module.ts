import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InstakitRecordsComponent} from './instakit-records.component';
const routes: Routes = [{ path: '', component: InstakitRecordsComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstakitRecordsRoutingModule { }
