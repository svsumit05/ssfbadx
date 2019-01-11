import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorsRoutingModule } from './vendors-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { VendorsComponent } from './vendors.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        VendorsRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [VendorsComponent]
})
export class VendorsModule { }
