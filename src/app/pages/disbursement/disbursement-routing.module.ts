import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DisbursementComponent} from './disbursement.component';
const routes: Routes = [
    {path: 'Upload', component: DisbursementComponent},
    {path: 'Photo_Receipt', component: DisbursementComponent},
    {path: 'Verify', component: DisbursementComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class DisbursementRoutingModule {}
