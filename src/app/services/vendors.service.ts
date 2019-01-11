import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class VendorsService {

    private ticket: string;


    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }

    createVendor(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/addVendorModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    createCourier(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/addCourierModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateVendor(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateVendorModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    updateCourier(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateCourierModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }


    performVendorApprovalAction(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('vendorModId', sendPostData.vendorModifiedId);
        form.append('alf_ticket', sendPostData.alf_ticket);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performVendorApprovalAction?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    performCourierApprovalAction(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('courierModId', sendPostData.courierModifiedId);
        form.append('alf_ticket', sendPostData.alf_ticket);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performCourierApprovalAction?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getVendorsList() {
        let headers = new Headers();
        let form = new FormData();
        form.append('vendorId', '');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedVendorRecords?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }


    fetchAllWorkLineProduct() {
        let headers = new Headers();
        let form = new FormData();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllWorkLineProduct?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getCourierList() {
        let headers = new Headers();
        let form = new FormData();
        form.append('courierId', '');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedCourierRecords?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    createDocument(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/addDocumentType?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateDocument(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/updateDocumentType?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    getDocumentList() {
        let headers = new Headers();
        let form = new FormData();
        form.append('documentId', '');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/fetchAllDocumentTypes?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    fetchAllRecordTypes() {
        let headers = new Headers();
        let form = new FormData();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/recordController/fetchAllRecordTypes?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

}
