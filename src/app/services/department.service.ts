import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import { UserService } from './user.service';

@Injectable()
export class DepartmentService {

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



  editDepartment(values: any) {

    let sendPostData = {};

    sendPostData = {
      departmentId: values.departmentId,
      departmentName: values.departmentName,
      isActive: 1
    };

    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/Department/editDepartment?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  addDepartment(values: any) {

    let sendPostData = {};

    sendPostData = {
      departmentName: values.DepartmentName,
      isActive: 1
    };

    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/Department/addDepartment?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

}
