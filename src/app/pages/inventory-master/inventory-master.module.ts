import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryMasterRoutingModule } from './inventory-master-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { InventoryMasterComponent } from './inventory-master.component';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        InventoryMasterRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [InventoryMasterComponent]
})
export class InventoryMasterModule { }