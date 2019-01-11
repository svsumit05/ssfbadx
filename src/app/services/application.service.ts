import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class ApplicationService {

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


    addApplication(sendPostData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (sendPostData.isAPIAvailable == true) {
            sendPostData.isAPIAvailable = 1;
        } else {
            sendPostData.isAPIAvailable = 0;
        }

        if (sendPostData.isEmailAvailable == true) {
            sendPostData.isEmailAvailable = 1;
        } else {
            sendPostData.isEmailAvailable = 0;
        }

        if (sendPostData.isActive == true) {
            sendPostData.isActive = 1;
        } else {
            sendPostData.isActive = 0;
        }

        let postData = {
            applicationName: sendPostData.applicationName,
            createdBy: sendPostData.createdBy,
            isActive: sendPostData.isActive,
            isAPIAvailable: sendPostData.isAPIAvailable,
            isEmailAvailable: sendPostData.isEmailAvailable,
            appOwnerId: sendPostData.appOwnerId
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/addApplication?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateApplication(sendPostData: any) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (sendPostData.isAPIAvailable == true) {
            sendPostData.isAPIAvailable = 1;
        } else {
            sendPostData.isAPIAvailable = 0;
        }

        if (sendPostData.isEmailAvailable == true) {
            sendPostData.isEmailAvailable = 1;
        } else {
            sendPostData.isEmailAvailable = 0;
        }

        if (sendPostData.isActive == true) {
            sendPostData.isActive = 1;
        } else {
            sendPostData.isActive = 0;
        }

        let postData = {
            applicationId: sendPostData.applicationId,
            applicationName: sendPostData.applicationName,
            createdBy: sendPostData.createdBy,
            isActive: sendPostData.isActive,
            isAPIAvailable: sendPostData.isAPIAvailable,
            isEmailAvailable: sendPostData.isEmailAvailable,
            lastUpdatedBy: sendPostData.lastUpdatedBy,
            appOwnerId: sendPostData.appOwnerId
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/updateApplication?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }



}
