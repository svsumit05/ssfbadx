import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { DeptTempListRoutingModule } from './dept-temp-list-routing.module';
import { DeptTempListComponent } from './dept-temp-list.component';
import { SmsTempService } from '../../services/sms-temp.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DeptTempListRoutingModule,
    AlertModule,
  ],
  declarations: [DeptTempListComponent],
  providers: [SmsTempService]
})
export class DeptTempListModule { }
