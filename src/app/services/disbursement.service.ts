import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {UserService} from './user.service';

@Injectable()
export class DisbursementService {

    private ticket: string;


    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    getPendingTask(worflowId: any) {

        let postData = {'id': '' + worflowId + ''};

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/sample/getTaskByID?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    uploadReceiptTask(worflowId: any) {

        let postData = {'taskId': '' + worflowId + ''};

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/disbursement/getDocument?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    assignTask(worflowId: any) {

        let postData = {'taskId': '' + worflowId + ''};

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/disbursement/getDocument?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    updateDisbmtWorkflowStatus(worflowId: any, wfs) {

        let postData = {
            'disbursmentId': worflowId,
            'outcome': wfs.value,
            'comment': wfs.display
        };

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/disbursement/approveReject?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    deleteDisbmtWorkflow(worflowId: any) {

        const postData = {
            'id': worflowId
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/disbursement/deleteWorkflow?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }



    getDisbmtPhotoStatus() {
        return [
            {id: 'Pending', name: 'Pending'},
            {id: 'Completed', name: 'Completed'}
        ];
    }


    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }


}
