import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryLimitRoutingModule} from './inventory-limit-routing.module';
import {FormsModule} from '@angular/forms';
import {AlertModule} from 'ng2-bootstrap';
import {InventoryLimitComponent} from './inventory-limit.component';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        InventoryLimitRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [InventoryLimitComponent]
})
export class InventoryLimitModule {}