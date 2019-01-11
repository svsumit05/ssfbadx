import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouriorsRoutingModule } from './couriors-routing.module';
import { AlertModule } from 'ng2-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { DataTablesModule } from 'angular-datatables';
import { CouriorsComponent } from './couriors.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule,
        CouriorsRoutingModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [CouriorsComponent]
})
export class CouriorsModule {}
