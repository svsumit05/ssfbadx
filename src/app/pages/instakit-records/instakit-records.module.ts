import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstakitRecordsRoutingModule } from './instakit-records-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { InstakitRecordsComponent } from './instakit-records.component';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        InstakitRecordsRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [InstakitRecordsComponent]
})
export class InstakitRecordsModule { }