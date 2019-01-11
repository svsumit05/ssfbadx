import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class RecordmgmService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }


    addNewRecord(postData: any) {

        let headers = new Headers();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/addNewRecord?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateRecordByBranchUser(postData: any) {

        let headers = new Headers();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateRecordByBranchUser?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateRecordByCPUUser(postData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('branchDocumentRecordId', postData.branchDocumentRecordId);
        form.append('loggedInuserName', postData.loggedInuserName);
        if (postData.action == 'REJECT') {
            form.append('receiptDate', '');
        } else {
            form.append('receiptDate', postData.receiptDate);
        }
        form.append('action', postData.action);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateRecordByCPUUser?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateRecordByVendor(postData: any) {

        let headers = new Headers();

        let headers = new Headers();
        let form = new FormData();
        form.append('branchDocumentRecordId', postData.branchDocumentRecordId);
        form.append('receiptDate', postData.receiptDate);
        form.append('loggedInuserName', postData.loggedInuserName);
        form.append('fileBarode', postData.fileBarode);
        form.append('cartonBarcode', postData.cartonBarcode);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateRecordByVendor?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    queryRecord(postData: any) {

        console.log(postData);

        let headers = new Headers();

        let headers = new Headers();
        let form = new FormData();
        form.append('documentType', '');
        form.append('referenceType', postData.referenceType);
        form.append('referenceValue', postData.referenceValue);
        form.append('branchCode', postData.branchCode);
        form.append('date', postData.date);
        form.append('recordTypeId', postData.recordTypeId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/fetchVendorSubmittedRecordByReferencceTypeAndBrachWise?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    sendRetrivalRecordForCSUApproval(postData: any) {

        let headers = new Headers();

        let headers = new Headers();
        let form = new FormData();

        if (postData.isPhysicalCopyRequired) {
            form.append('isPhysicalCopyRequired', 1);
        } else {
            form.append('isPhysicalCopyRequired', 0);
        }

        form.append('documentRecordId', postData.documentRecordId);
        form.append('documentName', postData.documentName);
        form.append('loggendInUserName', postData.loggendInUserName);


        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/sendRetrivalRecordForCSUApproval?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    uploadDocument(postData: any) {
        let headers = new Headers();

        let headers = new Headers();
        let form = new FormData();
        form.append('inputFiles', postData.documentName);

        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateRetrivedRecordByCPU(postData: any) {

        let headers = new Headers();
        let form = new FormData();
        form.append('remarks', postData.remarks);
        form.append('action', postData.action);
        form.append('loggedInuserName', postData.loggedInuserName);
        form.append('branchDocumentRecordretrivalID', postData.branchDocumentRecordretrivalID);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateRetrivedRecordByCPU?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateRetRecdToUpdateAcceptanceStatusByBranchUser(postData: any) {

        let headers = new Headers();
        let form = new FormData();
        form.append('action', postData.action);
        form.append('loggedInuserName', postData.loggedInuserName);
        form.append('branchDocumentRecordretrivalID', postData.branchDocumentRecordretrivalID);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateRetRecdToUpdateAcceptanceStatusByBranchUser?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    sendRetrivalRecordBackToVendor(postData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let sendPostData = {
            branchDocumentRecordRetrivalID: postData.branchDocumentRecordretrivalID,
            couriername: postData.courier,
            awbNo: postData.awbno,
            dispatchDate: postData.receiptdate
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/sendRetrivalRecordBackToVendor?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    bulkRecordUpload(postData: any) {

        let headers = new Headers();
        let form = new FormData();
        form.append('uploadingFiles', postData.uploadingFiles);
        form.append('uploadedBy', postData.uploadedBy);
        form.append('recordTypeId', postData.recordTypeId);
        form.append('roleId', postData.roleId);
        form.append('loggedInUserBranchCode', postData.loggedInUserBranchCode);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/bulkRecordUpload?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateBulkRecord(postData: any) {

        let headers = new Headers();
        let form = new FormData();
        form.append('uploadingFiles', postData.uploadingFiles);
        form.append('uploadedBy', postData.uploadedBy);
        form.append('recordTypeId', postData.recordTypeId);
        form.append('roleId', postData.roleId);
        form.append('loggedInUserBranchCode', postData.loggedInUserBranchCode);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateBulkRecord?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    downloadRecordPendingForBranch(sendPostData: any) {

        let api_url = 'startDate=' + sendPostData.startDate + '&endDate=' + sendPostData.endDate + '&branchCode=' + sendPostData.branchCode + '&recordTypeId=' + sendPostData.recordTypeId;

        window.open(environment.api_base_url_new + 'BranchCreation/recordController/downloadRecordPendingForBranch?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
    }

    downloadSampleReport(recordTypeId: any) {

        let api_url = 'recordTypeId=' + recordTypeId;

        window.open(environment.api_base_url_new + 'BranchCreation/recordController/downloadBlanktemplate?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
    }


    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }

}
