import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { TempListRoutingRejectModule } from './temp-list-reject-routing.module';
import { TempListRejectComponent } from './temp-list-reject.component';

import { SmsTempService } from '../../services/sms-temp.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TempListRoutingRejectModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [TempListRejectComponent],
  providers: [SmsTempService]
})
export class TempListRejectModule { }
