import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouriorsComponent } from './couriors.component';
const routes: Routes = [{ path: '', component: CouriorsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouriorsRoutingModule { }
