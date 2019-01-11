import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { UserMatrixReviewRoutingModule } from './user-matrix-review-routing.module';
import { UserMatrixReviewComponent } from './user-matrix-review.component';

import { UserMatrixService } from '../../services/user-matrix.service';

@NgModule({
  imports: [
    CommonModule,
    UserMatrixReviewRoutingModule,
    FormsModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [UserMatrixReviewComponent],
  providers: [UserMatrixService]
})
export class UserMatrixReviewModule { }
