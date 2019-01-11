import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstakitReturnRoutingModule } from './instakit-return-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { InstakitReturnComponent } from './instakit-return.component';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        InstakitReturnRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [InstakitReturnComponent]
})
export class InstakitReturnModule { }