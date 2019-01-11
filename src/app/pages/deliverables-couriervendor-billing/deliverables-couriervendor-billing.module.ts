import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertModule} from 'ng2-bootstrap';
import {DeliverablesCouriervendorBillingComponent} from './deliverables-couriervendor-billing.component';
import {PopupModule} from 'ng2-opd-popup';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import { DeliverablesCouriervendorBillingRoutingModule } from './deliverables-couriervendor-billing-routing.module';



@NgModule({
  imports: [
    CommonModule,
    DeliverablesCouriervendorBillingRoutingModule,
    FormsModule,
    AlertModule,
    PopupModule.forRoot(),
    NKDatetimeModule
  ],
  declarations: [DeliverablesCouriervendorBillingComponent]
})
export class DeliverablesCouriervendorBillingModule { }
