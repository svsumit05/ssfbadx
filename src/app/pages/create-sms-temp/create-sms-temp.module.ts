import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule, TypeaheadModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { DataTablesModule } from 'angular-datatables';
import { CreateSmsTempRoutingModule } from './create-sms-temp-routing.module';
import { CreateSmsTempComponent } from './create-sms-temp.component';
import { SmsTempService } from '../../services/sms-temp.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlertModule,
    TypeaheadModule.forRoot(),
    CreateSmsTempRoutingModule,
    NKDatetimeModule,
    DataTablesModule,
  ],
  declarations: [CreateSmsTempComponent],
  providers : [SmsTempService]
})
export class CreateSmsTempModule { }
