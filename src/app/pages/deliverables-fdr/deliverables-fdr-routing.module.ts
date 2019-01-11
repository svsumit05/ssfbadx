import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliverablesFdrComponent } from './deliverables-fdr.component';
const routes: Routes = [{ path: '', component: DeliverablesFdrComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeliverablesFdrRoutingModule { }
