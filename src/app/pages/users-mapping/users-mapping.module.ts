import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { UsersMappingRoutingModule } from './users-mapping-routing.module';
import { UsersMappingComponent } from './users-mapping.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersMappingRoutingModule,
    AlertModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [UsersMappingComponent]
})
export class UsersMappingModule { }
