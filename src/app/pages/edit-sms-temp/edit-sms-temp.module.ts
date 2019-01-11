import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { DataTablesModule } from 'angular-datatables';
import { EditSmsTempRoutingModule } from './edit-sms-temp-routing.module';
import { EditSmsTempComponent } from './edit-sms-temp.component';
import { SmsTempService } from '../../services/sms-temp.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TypeaheadModule.forRoot(),
    EditSmsTempRoutingModule,
    NKDatetimeModule,
    DataTablesModule,
  ],
  declarations: [EditSmsTempComponent],
  providers : [SmsTempService]
})
export class EditSmsTempModule { }
