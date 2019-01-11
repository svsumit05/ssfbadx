import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrBillingRoutingModule} from './br-billing-routing.module';
import {BrBillingComponent} from './br-billing.component';
import {AlertModule, DatepickerModule, TabsModule, AccordionModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';



@NgModule({
    imports: [
        CommonModule,
        BrBillingRoutingModule,
        FormsModule,
        AlertModule,
        DatepickerModule,
        TabsModule,
        AccordionModule,
        NKDatetimeModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [BrBillingComponent]
})
export class BrBillingModule {}
