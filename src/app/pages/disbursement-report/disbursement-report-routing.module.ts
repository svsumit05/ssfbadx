import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisbursementReportComponent } from './disbursement-report.component';
const routes: Routes = [{ path: '', component: DisbursementReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisbursementReportRoutingModule { }
