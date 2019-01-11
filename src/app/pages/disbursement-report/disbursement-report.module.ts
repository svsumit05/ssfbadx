import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DisbursementReportRoutingModule} from './disbursement-report-routing.module';
import {FormsModule} from '@angular/forms';
import {AlertModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {DisbursementReportComponent} from './disbursement-report.component';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DisbursementReportRoutingModule,
        AlertModule,
        NKDatetimeModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [DisbursementReportComponent]
})
export class DisbursementReportModule {}
