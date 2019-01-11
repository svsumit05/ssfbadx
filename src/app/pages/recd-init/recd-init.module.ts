import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecdInitRoutingModule } from './recd-init-routing.module';

import { RecdInitComponent } from './recd-init.component';
import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { RecordmgmService } from '../../services/recordmgm.service';

@NgModule({
  imports: [
    CommonModule,
    RecdInitRoutingModule,
    FormsModule,
    AlertModule,
    DatepickerModule,
    TabsModule,
    NKDatetimeModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [RecdInitComponent],
  providers: [RecordmgmService]
})
export class RecdInitModule { }
