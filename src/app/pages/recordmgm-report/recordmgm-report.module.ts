import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordmgmReportRoutingModule } from './recordmgm-report-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { RecordmgmReportComponent } from './recordmgm-report.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        DatepickerModule,
        TabsModule,
        NKDatetimeModule,
        RecordmgmReportRoutingModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [RecordmgmReportComponent]
})
export class RecordmgmReportModule { }

