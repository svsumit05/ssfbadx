import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsReportComponent } from './sms-report.component';
import { SmsReportRoutingModule } from './sms-report-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { SmsTempService } from '../../services/sms-temp.service'

@NgModule({
  imports: [
    CommonModule,
    SmsReportRoutingModule,
    FormsModule,
    AlertModule,
    NKDatetimeModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [SmsReportComponent],
  providers: [SmsTempService]
})
export class SmsReportModule { }
