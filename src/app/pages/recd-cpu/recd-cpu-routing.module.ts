import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecdCpuComponent } from './recd-cpu.component';
const routes: Routes = [{ path: '', component: RecdCpuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecdCpuRoutingModule { }
