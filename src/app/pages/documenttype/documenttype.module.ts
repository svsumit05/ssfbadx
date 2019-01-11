import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumenttypeRoutingModule } from './documenttype-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { DocumenttypeComponent } from './documenttype.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        DocumenttypeRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [DocumenttypeComponent]
})
export class DocumenttypeModule { }
