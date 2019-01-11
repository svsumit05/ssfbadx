import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderListRoutingModule} from './order-list-routing.module';
import {FormsModule} from '@angular/forms';
import {AlertModule, DatepickerModule, TabsModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {OrdersListComponent} from './orders-list.component';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        DatepickerModule,
        TabsModule,
        NKDatetimeModule,
        OrderListRoutingModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [OrdersListComponent]
})
export class OrderListModule {}
