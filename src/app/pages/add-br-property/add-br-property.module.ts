import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertModule, DatepickerModule, TabsModule,AccordionModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {AddBrPropertyRoutingModule} from './add-br-property-routing.module';
import {AddBrPropertyComponent} from './add-br-property.component';
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
        AccordionModule,
        NKDatetimeModule,
        AddBrPropertyRoutingModule,
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [AddBrPropertyComponent]
})
export class AddBrPropertyModule {}
