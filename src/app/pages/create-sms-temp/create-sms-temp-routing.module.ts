import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSmsTempComponent } from './create-sms-temp.component';
const routes: Routes = [{ path: '', component: CreateSmsTempComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSmsTempRoutingModule { }
