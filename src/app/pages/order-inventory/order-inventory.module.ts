import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderInventoryRoutingModule } from './order-inventory-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { OrderInventoryComponent } from './order-inventory.component';
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
        OrderInventoryRoutingModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [OrderInventoryComponent]
})
export class OrderInventoryModule { }

