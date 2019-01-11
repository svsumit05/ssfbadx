import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {UserService} from './user.service';

@Injectable()
export class DeliverablesService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    getDeliverablesById(postData: any) {

        let ACNO = 0;
        let customerId = 0;
        let step_id = 0;
        let awb_no = 0;

        if (postData.search_by == 'account_no') {
            ACNO = postData.search_id;
            step_id = 1;
        }

        if (postData.search_by == 'cust_id') {
            customerId = postData.search_id;
            step_id = 2;
        }

        if (postData.search_by == 'awb_no') {
            awb_no = postData.search_id;
            step_id = 3;
        }

        let postDataSend = {
            'deliverableType': postData.deliverables_type,
            'ACNO': ACNO,
            'customerId': customerId,
            'awb_no': awb_no,
            'step': step_id
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/searchInventory?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateRTOStatus(postData: any) {

        console.log(postData);

        let dateString = '';
        let r_dateString = '';
        let r2_dateString = '';

        if (postData.branch_action_date != '') {
            let newDate = new Date(postData.branch_action_date);
            dateString += newDate.getFullYear() + '-';
            dateString += (newDate.getMonth() + 1) + '-';
            dateString += newDate.getDate();
        }

        if (postData.rtoReceiptTime) {
            let r_newDate = new Date(postData.rtoReceiptTime);
            r_dateString += r_newDate.getFullYear() + '-';
            r_dateString += (r_newDate.getMonth() + 1) + '-';
            r_dateString += r_newDate.getDate();
        }

        if (postData.branchActionTime2) {
            let r2_newDate = new Date(postData.branchActionTime2);
            r2_dateString += r2_newDate.getFullYear() + '-';
            r2_dateString += (r2_newDate.getMonth() + 1) + '-';
            r2_dateString += r2_newDate.getDate();
        }

        let postDataSend = {
            'id': postData.id,
            'rtoStep': postData.rtoStep,
            'accountNo': postData.rtoAcNo,
            'rtoReceipt': postData.rtoReceipt,
            'rtoReceiptTime': r_dateString,
            'action': postData.rtoAction,
            'deliverableType': postData.deliverables_type,
            'action_aws_no': postData.action_aws_no,
            'action_courier_name': postData.action_courier_name,
            'branch_action': postData.branch_action,
            'branchActionTime': r2_dateString,
            'branch_action_date': dateString,
            'branch_action_reason': postData.branch_action_reason,
            'remark': postData.remark,
            'rtoAction': '',
            'rtoActionDate': '',
            'rtoAWBNO': '',
            'rtoCourierName': ''
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/updateRTOStatus?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getReport(userId) {

        let headers = new Headers();
        let form = new FormData();

        form.append('userId', userId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/DLMS/getReport?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getBranch() {

        return this._http.get(environment.api_base_url + 'alfresco/s/suryoday/getDLMSBranch?alf_ticket=' + this.ticket)
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getCollatedReport(postData) {

        let newFromDate = '';
        let fromDate = new Date(postData.fromDate);
        newFromDate += fromDate.getFullYear() + '-';
        newFromDate += (fromDate.getMonth() + 1) + '-';
        newFromDate += fromDate.getDate();


        let newToDate = '';
        let toDate = new Date(postData.toDate);
        newToDate += toDate.getFullYear() + '-';
        newToDate += (toDate.getMonth() + 1) + '-';
        newToDate += toDate.getDate();

        let postDataSend = {
            'fromDate': newFromDate,
            'toDate': newToDate,
            'branchName': postData.branchName
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/getCollatedReport?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    downloadReport(postData) {

        let newFromDate = '';
        let fromDate = new Date(postData.fromDate);
        newFromDate += fromDate.getFullYear() + '-';
        newFromDate += (fromDate.getMonth() + 1) + '-';
        newFromDate += fromDate.getDate();


        let newToDate = '';
        let toDate = new Date(postData.toDate);
        newToDate += toDate.getFullYear() + '-';
        newToDate += (toDate.getMonth() + 1) + '-';
        newToDate += toDate.getDate();


        let api_url = 'deliverableType=' + postData.deliverableType + '&status=' + postData.status + '&branchName=' + postData.branchName + '&fromDate=' + newFromDate + '&toDate=' + newToDate;

        window.open(environment.api_base_url + 'alfresco/s/suryoday/downloadReportData?alf_ticket=' + this.ticket + '&' + api_url, '_blank');

    }

    downloadAgengReport(postData) {
        window.open(environment.api_base_url + postData + '&alf_ticket=' + this.ticket, '_blank');
    }

    getProdDeliverables(postData) {

        let newFromDate = '';
        let fromDate = new Date(postData.fromDate);
        newFromDate += fromDate.getFullYear() + '-';
        newFromDate += (fromDate.getMonth() + 1) + '-';
        newFromDate += fromDate.getDate();


        let newToDate = '';
        let toDate = new Date(postData.toDate);
        newToDate += toDate.getFullYear() + '-';
        newToDate += (toDate.getMonth() + 1) + '-';
        newToDate += toDate.getDate();

        let postDataSend = {
            'fromDate': newFromDate,
            'toDate': newToDate,
            'vendorName': postData.vendorName,
            'deliverableType': postData.deliverableType
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/prepareProductionBill?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    saveProdDeliverables(postData) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/submitProductionBill?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    saveCourierDeliverables(postData) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/submitCourierBill?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    getCourierDeliverables(postData) {

        let newFromDate = '';
        let fromDate = new Date(postData.fromDate);
        newFromDate += fromDate.getFullYear() + '-';
        newFromDate += (fromDate.getMonth() + 1) + '-';
        newFromDate += fromDate.getDate();


        let newToDate = '';
        let toDate = new Date(postData.toDate);
        newToDate += toDate.getFullYear() + '-';
        newToDate += (toDate.getMonth() + 1) + '-';
        newToDate += toDate.getDate();

        let headers = new Headers();

        let form = new FormData();
        form.append('fromDate', newFromDate);
        form.append('toDate', newToDate);
        form.append('vendorName', postData.vendorName);

        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/prepareCourierBill?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateVendorFile(postData) {

        let newFromDate = '';
        let fromDate = new Date(postData.fromDate);
        newFromDate += fromDate.getFullYear() + '-';
        newFromDate += (fromDate.getMonth() + 1) + '-';
        newFromDate += fromDate.getDate();


        let newToDate = '';
        let toDate = new Date(postData.toDate);
        newToDate += toDate.getFullYear() + '-';
        newToDate += (toDate.getMonth() + 1) + '-';
        newToDate += toDate.getDate();

        let headers = new Headers();

        let form = new FormData();
        form.append('fromDate', newFromDate);
        form.append('toDate', newToDate);
        form.append('vendorName', postData.vendorName);
        form.append('inputFiles', postData.inputFiles);

        return this._http.post(environment.api_base_url + 'alfresco/s/DLMS/prepareCourierBill?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateDestructionStatus(postData: any) {

        let dateString = '';

        console.log(postData);

        if (postData.rtoActionDate != '') {
            let newDate = new Date(postData.rtoActionDate);
            dateString += newDate.getFullYear() + '-';
            dateString += (newDate.getMonth() + 1) + '-';
            dateString += newDate.getDate();
        }

        let postDataSend = {
            'id': postData.id,
            'rtoStep': postData.rtoStep,
            'rtoAction': postData.rtoAction,
            'rtoActionDate': dateString,
            'rtoAWBNO': postData.rtoAWBNO,
            'rtoCourierName': postData.rtoCourierName,
            'accountNo': postData.rtoAcNo,
            'rtoReceipt': '',
            'rtoReceiptTime': '',
            'action': '',
            'deliverableType': postData.deliverables_type,
            'action_aws_no': '',
            'action_courier_name': '',
            'branch_action': '',
            'branchActionTime': '',
            'branch_action_date': '',
            'branch_action_reason': '',
            'remark': ''
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/updateRTOStatus?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getDestructionlist(postData: any) {

        let postDataSend = {
            'deliverableType': postData
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/fetchCPUPendingRecord?alf_ticket=' + this.ticket, postDataSend, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    submitDestructionData(postData: any) {

        console.log(postData);

        let dateString = '';
        let r_dateString = '';
        let r_dateString1 = '';

        if (postData.receivedAtCPUDate != '') {
            let newDate = new Date(postData.receivedAtCPUDate);
            dateString += newDate.getFullYear() + '-';
            dateString += (newDate.getMonth() + 1) + '-';
            dateString += newDate.getDate();
        }

        if (postData.discardedDate != '') {
            let r_newDate = new Date(postData.discardedDate);
            r_dateString += r_newDate.getFullYear() + '-';
            r_dateString += (r_newDate.getMonth() + 1) + '-';
            r_dateString += r_newDate.getDate();
        }

        if (postData.frcDate != '') {
            let r_newDate1 = new Date(postData.frcDate);
            r_dateString1 += r_newDate1.getFullYear() + '-';
            r_dateString1 += (r_newDate1.getMonth() + 1) + '-';
            r_dateString1 += r_newDate1.getDate();
        }



        let postDataSend = {
            'id': postData.id,
            'rtoStep': postData.rtoStep,
            'deliverableType': postData.deliverableType,
            'receivedAtCPU': postData.receivedAtCPU,
            'receivedAtCPUDate': dateString,
            'cpuAction': postData.cpuAction,
            'discardedDate': r_dateString,
            'frcDate': r_dateString1,
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/updateRTOStatus?alf_ticket=' + this.ticket, postDataSend, {
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
