import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { UserMatrixApprovalRoutingModule } from './user-matrix-approval-routing.module';
import { UserMatrixApprovalComponent } from './user-matrix-approval.component';

import { UserMatrixService } from '../../services/user-matrix.service';

@NgModule({
  imports: [
    CommonModule,
    UserMatrixApprovalRoutingModule,
    FormsModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [UserMatrixApprovalComponent],
  providers: [UserMatrixService]
})
export class UserMatrixApprovalModule { }
