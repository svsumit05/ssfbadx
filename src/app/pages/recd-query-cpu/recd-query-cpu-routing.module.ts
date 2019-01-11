import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdQueryCpuComponent } from './recd-query-cpu.component';
const routes: Routes = [{ path: '', component: RecdQueryCpuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdQueryCpuRoutingModule { }
