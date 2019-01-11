import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecdQueryBranchactionRoutingModule } from './recd-query-branchaction-routing.module';
import { RecdQueryBranchactionComponent } from './recd-query-branchaction.component';

import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { RecordmgmService } from '../../services/recordmgm.service';

@NgModule({
  imports: [
    CommonModule,
    RecdQueryBranchactionRoutingModule,
    FormsModule,
    AlertModule,
    DatepickerModule,
    TabsModule,
    NKDatetimeModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [RecdQueryBranchactionComponent],
  providers: [RecordmgmService]
})
export class RecdQueryBranchactionModule { }
