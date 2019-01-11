import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecodCpuComponent } from './recod-cpu.component';
const routes: Routes = [{ path: '', component: RecodCpuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecodCpuRoutingModule { }
