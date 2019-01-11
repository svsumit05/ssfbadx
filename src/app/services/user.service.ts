import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class UserService {

    public currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private router: Router, private _http: Http) {
        // TODO
    }

    public setCurrentUser(user: User) {
        this.currentUser.next(user);
    }

    public logout() {
        let user = new User();
        user.connected = false;
        this.setCurrentUser(user);
        this.router.navigate(['login']);
    }

    deleteToken(alf_ticket: string) {

        return this._http.delete(environment.api_base_url + 'alfresco/s/api/login/ticket/' + alf_ticket + '?alf_ticket=' + alf_ticket)
            .timeout(200)
            .map((response: Response) => response.type)
            .catch(this._errorHandler);
    }

    getLogin(username: string, password: string) {

        let postData = JSON.stringify({ username: username, password: password });

        return this._http.post(environment.api_base_url + 'alfresco/s/api/login', postData)
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    getUserInfo(usertoken: string) {

        let postData = {};

        return this._http.post(environment.api_base_url + 'alfresco/s/suryoday/user-module/login?alf_ticket=' + usertoken, postData)
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    getUserInformation(usertoken: string, userId: any) {

        let headers = new Headers();

        let form = new FormData();
        form.append('userName', userId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/getUserInformation?alf_ticket=' + usertoken, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    canCurrentUser(permissionSting: string) {
        let currentUserData;
        let permission;
        this.currentUser.subscribe((user) => currentUserData = user);
        permission = (currentUserData.permissions || []);
        return (permission.indexOf(permissionSting) > -1);
    }

    _errorHandler(error: Response) {
        console.error(error);
        // window.location.reload();
        return Observable.throw(error || 'server error');
    }
}
