import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertModule, DatepickerModule, TabsModule, AccordionModule} from 'ng2-bootstrap';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {PopupModule} from 'ng2-opd-popup';
import {DataTablesModule} from 'angular-datatables';
import {AddAssetsRoutingModule} from './add-assets-routing.module';
import {AddAssetsComponent} from './add-assets.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AddAssetsRoutingModule,
        AlertModule,
        DatepickerModule,
        TabsModule,
        AccordionModule,
        NKDatetimeModule,
        DataTablesModule,
        PopupModule.forRoot()
    ],
    declarations: [AddAssetsComponent]
})
export class AddAssetsModule {}
