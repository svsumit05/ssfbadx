import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DeliverablesProductionvendorBillingComponent} from './deliverables-productionvendor-billing.component';

const routes: Routes = [{path: '', component: DeliverablesProductionvendorBillingComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliverablesProductionvendorBillingRoutingModule {}
