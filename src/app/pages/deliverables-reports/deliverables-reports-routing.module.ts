import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliverablesReportsComponent } from './deliverables-reports.component';
const routes: Routes = [{ path: '', component: DeliverablesReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeliverablesReportsRoutingModule { }
