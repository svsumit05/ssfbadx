import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminInventoryRoutingModule } from './admin-inventory-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { AdminInventoryComponent } from './admin-inventory.component';
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
        AdminInventoryRoutingModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [AdminInventoryComponent]
})
export class AdminInventoryModule { }

