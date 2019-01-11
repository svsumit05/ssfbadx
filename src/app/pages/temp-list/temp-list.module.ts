import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { TempListRoutingModule } from './temp-list-routing.module';
import { TempListComponent } from './temp-list.component';

import { SmsTempService } from '../../services/sms-temp.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TempListRoutingModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [TempListComponent],
  providers: [SmsTempService]
})
export class TempListModule { }
