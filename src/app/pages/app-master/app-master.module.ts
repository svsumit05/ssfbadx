import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMasterRoutingModule } from './app-master-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { AppMasterComponent } from './app-master.component';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { ApplicationService } from '../../services/application.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlertModule,
    AppMasterRoutingModule,
    DataTablesModule,
    PopupModule.forRoot()
  ],
  declarations: [AppMasterComponent],
  providers: [ApplicationService]
})
export class AppMasterModule { }
