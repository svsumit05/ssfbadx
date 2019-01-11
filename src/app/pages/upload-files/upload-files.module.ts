import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadFilesRoutingModule} from './upload-files-routing.module';
import {UploadFilesComponent} from './upload-files.component';
import {FormsModule} from '@angular/forms';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import {environment} from '../../../environments/environment';


const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address: 
    url: environment.api_base_url,
    maxFilesize: 2,
    timeout: environment.set_timeout_sec
};


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UploadFilesRoutingModule,
        DropzoneModule.forChild(DROPZONE_CONFIG)
    ],
    declarations: [UploadFilesComponent]
})
export class UploadFilesModule {}
