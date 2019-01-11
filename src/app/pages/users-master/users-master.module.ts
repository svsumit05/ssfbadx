import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersMasterRoutingModule} from './users-master-routing.module';
import {FormsModule} from '@angular/forms';
import {AlertModule} from 'ng2-bootstrap';
import {UsersMasterComponent} from './users-master.component';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        UsersMasterRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [UsersMasterComponent]
})
export class UsersMasterModule {}
