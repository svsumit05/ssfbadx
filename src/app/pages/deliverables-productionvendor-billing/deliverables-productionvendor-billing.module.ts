import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertModule} from 'ng2-bootstrap';
import {DeliverablesProductionvendorBillingComponent} from './deliverables-productionvendor-billing.component';
import {PopupModule} from 'ng2-opd-popup';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {DeliverablesProductionvendorBillingRoutingModule} from './deliverables-productionvendor-billing-routing.module';



@NgModule({
  imports: [
    CommonModule,
    DeliverablesProductionvendorBillingRoutingModule,
    FormsModule,
    AlertModule,
    PopupModule.forRoot(),
    NKDatetimeModule
  ],
  declarations: [DeliverablesProductionvendorBillingComponent]
})
export class DeliverablesProductionvendorBillingModule { }
