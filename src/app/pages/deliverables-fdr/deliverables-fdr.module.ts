import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeliverablesFdrRoutingModule} from './deliverables-fdr-routing.module';
import {FormsModule} from '@angular/forms';
import {AlertModule, DatepickerModule, TabsModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {DeliverablesFdrComponent} from './deliverables-fdr.component';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        DatepickerModule,
        TabsModule,
        DeliverablesFdrRoutingModule,
        NKDatetimeModule
    ],
    declarations: [DeliverablesFdrComponent,CustomDatePipe]
})
export class DeliverablesFdrModule {}
