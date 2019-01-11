import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditSmsTempComponent } from './edit-sms-temp.component';
const routes: Routes = [{ path: '', component: EditSmsTempComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSmsTempRoutingModule { }
