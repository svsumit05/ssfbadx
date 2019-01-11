import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';


@Injectable()
export class MyProfileService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    changePassword(password: string) {

        let postData = { 'oldPassword': password.old_password, 'newPassword': password.myProfilePassword };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/changePassword?alf_ticket=' + this.ticket, postData, {
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
