import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersReportRoutingModule } from './users-report-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule, DatepickerModule, TabsModule } from 'ng2-bootstrap';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { UsersReportComponent } from './users-report.component';
import { UserMatrixService } from '../../services/user-matrix.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        DatepickerModule,
        NKDatetimeModule,
        UsersReportRoutingModule
    ],
    declarations: [UsersReportComponent],
    providers: [UserMatrixService]
})
export class UsersReportModule { }

