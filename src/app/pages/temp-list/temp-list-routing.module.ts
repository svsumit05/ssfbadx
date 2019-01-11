import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TempListComponent } from './temp-list.component';
const routes: Routes = [{ path: '', component: TempListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempListRoutingModule { }
