import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {UserService} from './user.service';

@Injectable()
export class DlmsBillingService {

    private ticket: string;


    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    createVendorBilling(orderReceivedDetails: any) {
        let headers = new Headers();

        let form = new FormData();
        form.append('taskId', orderReceivedDetails.id);
        form.append('amount', orderReceivedDetails.inventAmount);
        form.append('inputFiles', orderReceivedDetails.inputFile);

        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/createBill?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    updateAdminBilling(orderReceivedDetails: any) {
        let headers = new Headers();

        let postData = {
            'taskId': orderReceivedDetails.id,
            'amountToBePaid': orderReceivedDetails.inventAmountToPaid
        };
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/updateBill?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    updateAdminPayment(orderReceivedDetails: any) {
        let headers = new Headers();

        let postData = {
            'billNo': orderReceivedDetails.billNo,
            'modeOfPayment': orderReceivedDetails.inventModePayment,
            'detailOfPayment': orderReceivedDetails.inventDetailPayment,
            'dateOfPayment': orderReceivedDetails.inventDatePayment
        };

        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/paymentDetail?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }


    getTaskByBillId (billId: any) {

         return this._http.get(environment.api_base_url + 'alfresco/s/suryoday/getTaskByInvoiceNo?alf_ticket=' + this.ticket + '&invoiceNo=' + billId )
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);

    }

    createCPUBilling(orderReceivedDetails: any) {

        let headers = new Headers();

        let postData = {
            'bilIid': orderReceivedDetails.billNo,
            'outcome': orderReceivedDetails.inventStatus
        };

        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/CPUBillApproval?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

   generateVendorBilling(genBill: any) {
        let headers = new Headers();

        let postData = {
            'taskId': genBill.invoiceSelected,
            'billNo': genBill.invoiceNo
        };

        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/vendorBill?alf_ticket=' + this.ticket, postData, {
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

