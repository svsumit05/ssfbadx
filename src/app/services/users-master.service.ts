import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';


@Injectable()
export class UsersMasterService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    createUser(postData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/userModule/createUser?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getUser(employeeId: any) {

        let postData = { 'employeeId': employeeId };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        let headers1 = new Headers();
        let form = new FormData();
        form.append('userName', employeeId);

            return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/userModule/getUser?alf_ticket=' + this.ticket, postData, {
                headers: headers
            })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .flatMap((userInfo: any) => {
                return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/getUserInformation?alf_ticket=' + this.ticket, form, {
                    headers: headers1
                })
                .map((res: any) => {
                    let extraInfo = res.json();
                    userInfo.extraInfo = extraInfo;
                    return userInfo;
                });
            })
            .catch(this._errorHandler);
    }

    updateUser(postData: any) {

        let postSendData = { 'employeeId': postData.employeeId, 'permissions': postData.permissions, 'isAdmin': false, 'branch': postData.branch, 'branchCode': postData.branchCode, 'email': postData.alfrescoEmail };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/userModule/updateUserEntry?alf_ticket=' + this.ticket, postSendData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    updateUserInformation(postData: any) {

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/updateUserInformation?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    deleteUser(employeeId: any) {

        return this._http.get(environment.api_base_url + 'alfresco/s/suryoday/userModule/deleteUser?alf_ticket=' + this.ticket + '&employeeId=' + employeeId)
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchAllDepartment() {
        return this._http.get(environment.api_base_url_new + 'BranchCreation/Department/fetchAllDepartment?alf_ticket=' + this.ticket)
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
