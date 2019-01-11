import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecdQueryRoutingModule } from './recd-query-routing.module';
import { RecdQueryComponent } from './recd-query.component';

import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { RecordmgmService } from '../../services/recordmgm.service';

@NgModule({
  imports: [
    CommonModule,
    RecdQueryRoutingModule,
    FormsModule,
    AlertModule,
    DatepickerModule,
    TabsModule,
    NKDatetimeModule,
  ],
  declarations: [RecdQueryComponent],
  providers: [RecordmgmService]
})
export class RecdQueryModule { }
