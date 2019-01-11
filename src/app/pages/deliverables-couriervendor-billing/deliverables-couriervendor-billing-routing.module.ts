import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliverablesCouriervendorBillingComponent } from './deliverables-couriervendor-billing.component';


const routes: Routes = [{ path: '', component: DeliverablesCouriervendorBillingComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliverablesCouriervendorBillingRoutingModule { }
