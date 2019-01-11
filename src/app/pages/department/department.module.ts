import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentRoutingModule } from './department-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { DepartmentComponent } from './department.component';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { DepartmentService } from '../../services/department.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DepartmentRoutingModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [DepartmentComponent],
  providers: [DepartmentService]
})
export class DepartmentModule { }
