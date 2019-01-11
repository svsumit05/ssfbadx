import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoiRoutingModule} from './loi-routing.module';
import {LoiComponent} from './loi.component';
import {PopupModule} from 'ng2-opd-popup';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoiRoutingModule,
        DataTablesModule,
        PopupModule.forRoot(),
        DropzoneModule.forChild()
    ],
    declarations: [LoiComponent]
})
export class LoiModule {}