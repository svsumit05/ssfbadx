import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumenttypeComponent } from './documenttype.component';
const routes: Routes = [{ path: '', component: DocumenttypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumenttypeRoutingModule { }
