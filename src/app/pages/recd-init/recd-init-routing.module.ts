import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecdInitComponent } from './recd-init.component';
const routes: Routes = [{ path: '', component: RecdInitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdInitRoutingModule { }
