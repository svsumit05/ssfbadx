import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecodQueryCpuRoutingModule } from './recod-query-cpu-routing.module';
import { RecodQueryCpuComponent } from './recod-query-cpu.component';

import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { RecordmgmService } from '../../services/recordmgm.service';

@NgModule({
  imports: [
    CommonModule,
    RecodQueryCpuRoutingModule,
    FormsModule,
    AlertModule,
    DatepickerModule,
    TabsModule,
    NKDatetimeModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [RecodQueryCpuComponent],
  providers: [RecordmgmService]
})
export class RecodQueryCpuModule { }
