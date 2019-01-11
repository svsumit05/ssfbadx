import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class OrderInventoryServiceService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    getInventoryList(productName) {
        let headers = new Headers();
        let form = new FormData();
        form.append('inventoryId', '');
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fethchActiveInventory?alf_ticket=' + this.ticket + '&productName=' + productName, form, {
            headers: headers
        })
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    addInventoryorder(postData: any, InstaKit) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let isInstaKit = 0;
        if (InstaKit == true) {
            isInstaKit = 1;
        }

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/orderIndentList?isInstaKit=' + isInstaKit + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    inserVisitingCardDetails(postData: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/inserVisitingCardDetails?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateInstaKitDispatchDetails(orderReceivedDetails: any) {
        let headers = new Headers();

        let form = new FormData();
        form.append('uploadedBy', orderReceivedDetails.uploadedBy);
        form.append('uploadingFiles', orderReceivedDetails.inputFile);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateInstaKitDispatchDetails?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateVendorOrderReceived(orderReceivedDetails: any) {
        let headers = new Headers();

        let form = new FormData();
        form.append('uploadedBy', orderReceivedDetails.uploadedBy);
        form.append('uploadingFiles', orderReceivedDetails.inputFile);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateInventoryDispatchDetails?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    performOrderIndentApprovalAction(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('orderIndntId', sendPostData.orderIndentId);
        form.append('alf_ticket', sendPostData.alf_ticket);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performOrderIndentApprovalAction?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    fetchOrderIndentTransByOrderInv(orderInventId) {

        let headers = new Headers();
        let form = new FormData();
        form.append('orderInventId', orderInventId);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchOrderIndentTransByOrderInv?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchInstaKitBeanList(orderInventId) {

        let headers = new Headers();
        let form = new FormData();
        form.append('orderInventId', orderInventId);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchInstaKitBeanList?orderInventId=' + orderInventId + '?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateIndentAcceptanceStatus(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('orderIndentTransId', sendPostData.orderIndentTransId);
        form.append('status', sendPostData.status);
        form.append('receiptDate', sendPostData.receiptDate);
        form.append('loggedInUser', sendPostData.loggedInUser);
        form.append('currentDispatchedQuantity', sendPostData.currentDispatchedQuantity);
        form.append('orderInventId', sendPostData.orderInventId);
        form.append('remark', sendPostData.remark);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateIndentAcceptanceStatus?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateInstakitAcceptanceStatus(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('instaKitId', sendPostData.orderIndentTransId);
        form.append('status', sendPostData.status);
        form.append('receiptDate', sendPostData.receiptDate);
        form.append('loggedInUser', sendPostData.loggedInUser);
        form.append('orderInventId', sendPostData.orderInventId);
        form.append('remark', sendPostData.remark);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateInstakitAcceptanceStatus?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    sendRecordBackToFRFC(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('instaKitId', sendPostData.instaKitId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/sendRecordBackToFRFC?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    performVendorProcessingRecords(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('orderIndntId', sendPostData.orderIndntId);
        form.append('alf_ticket', sendPostData.alf_ticket);
        form.append('vendorID', sendPostData.vendorID);
        form.append('courierId', sendPostData.courierId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performVendorProcessingRecords?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchAllInstaKitProductType() { 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchAllInstaKitProductType?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    assignInstaKitRecordsToEmployee(sendPostData) {
        let headers = new Headers();
        let form = new FormData();
        form.append('instaKitId', sendPostData.instaKitId);
        form.append('employeeId', sendPostData.employeeId);
        form.append('employeeName', sendPostData.employeeName);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/assignInstaKitRecordsToEmployee?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateFRFCStatus(sendPostData) {
        let headers = new Headers();
        let form = new FormData();
        form.append('instaKitId', sendPostData.instaKitId);
        form.append('action', sendPostData.action);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateFRFCStatus?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    performOrderIndentMultipleApprovalAction(sendPostData: any) {
        let headers = new Headers();
        let form = new FormData();

        form.append('action', sendPostData.action);
        form.append('userID', sendPostData.userID);
        form.append('comment', sendPostData.comment);
        form.append('alf_ticket', sendPostData.alf_ticket);

        sendPostData.orderIndentId.forEach(element => {
            form.append('orderIndntParam', element);
        });

        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performOrderIndentMultipleApprovalAction?alf_ticket=' + this.ticket, form, {
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

}
