import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BranchReportComponent} from './branch-report.component';
const routes: Routes = [{path: '', component: BranchReportComponent}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchReportRoutingModule {}
