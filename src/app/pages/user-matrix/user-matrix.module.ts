import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { UserMatrixRoutingModule } from './user-matrix-routing.module';
import { UserMatrixComponent } from './user-matrix.component';

import { UserMatrixService } from '../../services/user-matrix.service';

@NgModule({
  imports: [
    CommonModule,
    UserMatrixRoutingModule,
    FormsModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [UserMatrixComponent],
  providers: [UserMatrixService]
})
export class UserMatrixModule { }
