import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsReportComponent } from './sms-report.component';
const routes: Routes = [{ path: '', component: SmsReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsReportRoutingModule { }
