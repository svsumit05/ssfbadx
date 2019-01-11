import { Component, OnInit } from '@angular/core';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DeliverablesService } from '../../services/deliverables.service'
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

    private currentUser: User = new User();
    inputFiles: any = '';
    canUploadUserFile = true;

    constructor(private _userServ: UserService, private _utilService: UtilitiesHelper, private _deliverablesService: DeliverablesService, private toastr: ToasterService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    ngOnInit() {
        this.canUploadUserFile = !this._userServ.canCurrentUser('CAN_UPLOAD_USER_FILE');
    }

    public config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        clickable: false,
        autoReset: 1000
    };


    onFileTypeSelect(ev) {

        this.config.clickable = true;

        if (ev.target.value == 'vendor_file') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadVendorFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'courier_file') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadCourierFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'base_fdr') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadBaseFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'base_cheque_book') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadChequeBookFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'base_debit_card') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadDebitCardFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'base_prf_file') {

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/uploadPRFFile?alf_ticket=' + this.currentUser.ticket;

        } else if (ev.target.value == 'ad_create_user_file') {

            this.config.url = environment.api_base_url_new + 'BranchCreation/userCreationController/uploadWorklineFiles?alf_ticket=' + this.currentUser.ticket;

        }
    }

    onUploadError(args: any) {
        alert('Something went wrong: Please try again...');
    }

    onUploadComplete(args: any) {
        alert('File uploaded Sucessfully...');
    }



}
