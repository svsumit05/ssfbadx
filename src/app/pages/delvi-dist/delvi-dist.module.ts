import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DelviDistRoutingModule} from './delvi-dist-routing.module';
import {DelviDistComponent} from './delvi-dist.component';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DelviDistRoutingModule,
        NKDatetimeModule
    ],
    declarations: [DelviDistComponent]
})
export class DelviDistModule {}
