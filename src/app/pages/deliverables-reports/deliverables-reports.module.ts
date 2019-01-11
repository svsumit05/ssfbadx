import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliverablesReportsRoutingModule } from './deliverables-reports-routing.module';
import { FormsModule } from '@angular/forms';
import { DeliverablesReportsComponent } from './deliverables-reports.component';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DeliverablesReportsRoutingModule,
    NKDatetimeModule
  ],
  declarations: [DeliverablesReportsComponent]
})
export class DeliverablesReportsModule { }
