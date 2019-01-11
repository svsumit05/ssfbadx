import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CpuBillingComponent} from './cpu-billing.component';
const routes: Routes = [{path: '', component: CpuBillingComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CpuBillingRoutingModule {}
