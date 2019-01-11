import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class InventoryMasterService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    addInventrory(postData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/addInventoryModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateInventrory(postData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateInventoryModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchApprovedInventoryRecords() {

        let headers = new Headers();
        let form = new FormData();
        form.append('inventoryId', '');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedInventoryRecords?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }


    performVendorApprovalAction(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('inventoryModId', sendPostData.inventoryModId);
        form.append('alf_ticket', sendPostData.alf_ticket);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performInventoryApprovalAction?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    downloadFile(sendPostData: any) {


        let api_url = 'starDate=' + sendPostData.starDate + '&endDate=' + sendPostData.endDate + '&inventoryId=' + sendPostData.inventoryId + '&vendorId=' + sendPostData.vendorId + '&branchCode=' + sendPostData.branchCode + '&isReportDownload=1';

        window.open(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchOrderIndentReport?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
    }

    downloadBranchDocumentRetrivalReport(sendPostData: any) {


        let api_url = 'startDate=' + sendPostData.startDate + '&endDate=' + sendPostData.endDate + '&branchCode=' + sendPostData.branchCode + '&recordTypeId=' + sendPostData.recordTypeId;

        window.open(environment.api_base_url_new + 'BranchCreation/recordController/downloadBranchDocumentRetrivalReport?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
    }

    downloadBranchDocumentReport(sendPostData: any) {


        let api_url = 'startDate=' + sendPostData.startDate + '&endDate=' + sendPostData.endDate + '&branchCode=' + sendPostData.branchCode + '&recordTypeId=' + sendPostData.recordTypeId;

        window.open(environment.api_base_url_new + 'BranchCreation/recordController/downloadBranchDocumentReport?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
    }

}
