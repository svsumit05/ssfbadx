import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrereqValidateComponent } from './prereq-validate.component';
const routes: Routes = [{ path: '', component: PrereqValidateComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrereqValidateRoutingModule { }
