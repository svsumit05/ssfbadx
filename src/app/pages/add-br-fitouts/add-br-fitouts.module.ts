import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AddBrFitoutsRoutingModule} from './add-br-fitouts-routing.module';
import {AddBrFitoutsComponent} from './add-br-fitouts.component';
import {AlertModule, DatepickerModule, TabsModule, AccordionModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';


@NgModule({
    imports: [
        CommonModule,
        AddBrFitoutsRoutingModule,
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
    declarations: [AddBrFitoutsComponent]
})
export class AddBrFitoutsModule {}