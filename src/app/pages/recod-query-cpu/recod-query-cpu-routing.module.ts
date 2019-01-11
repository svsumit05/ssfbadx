import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecodQueryCpuComponent } from './recod-query-cpu.component';
const routes: Routes = [{ path: '', component: RecodQueryCpuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecodQueryCpuRoutingModule { }
