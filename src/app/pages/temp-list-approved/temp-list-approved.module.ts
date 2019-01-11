import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { TempListRoutingApprovedModule } from './temp-list-approved-routing.module';
import { TempListApprovedComponent } from './temp-list-approved.component';

import { SmsTempService } from '../../services/sms-temp.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TempListRoutingApprovedModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [TempListApprovedComponent],
  providers: [SmsTempService]
})
export class TempListApprovedModule { }
