import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BranchDetailsRoutingModule} from './branch-details-routing.module';
import {BranchDetailsComponent} from './branch-details.component';
import {FormsModule} from '@angular/forms';
import {AlertModule, DatepickerModule, TabsModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
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
        DropzoneModule.forChild(),
        DataTablesModule,
        PopupModule.forRoot(),
        BranchDetailsRoutingModule
    ],
    declarations: [BranchDetailsComponent]
})
export class BranchDetailsModule {}