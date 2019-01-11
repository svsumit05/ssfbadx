import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';


@Injectable()
export class UserMatrixService {

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

  fetchAllWorklineBusinessUnit() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let postData = {};

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllWorklineBusinessUnit?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchAllWorklineFunction() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let postData = {};

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllWorklineFunction?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchAllWorklineRole() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let postData = {};

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllWorklineRole?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchAllApplicationList() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let postData = {};

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllApplicationList?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  insertPredefineMatrix(sendPostData: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let postData = {
      workLineBusinessUnit: {
        businessUnitId: sendPostData.businessUnitId
      },
      worklineProduct: {
        productId: sendPostData.productId
      },
      workLineFunction: {
        worklineFunctionId: sendPostData.worklineFunctionId
      },
      worklineSubFunction: {
        worklineSubFunctionId: sendPostData.worklineSubFunctionId
      },
      workLineRole: {
        worklineRoleId: sendPostData.worklineRoleId
      },
      predefineApplRoleMatrixChildList: sendPostData.predefineApplRoleMatrixChildList,
      createdBy: sendPostData.createdBy
    };

    console.log(postData);

    /* let form = new FormData();
    form.append('action', sendPostData.action);
    form.append('userID', sendPostData.userID);
    form.append('comment', sendPostData.comment);
    form.append('vendorModId', sendPostData.vendorModifiedId);
    form.append('alf_ticket', sendPostData.alf_ticket); */

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/insertPredefineMatrix?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  updatePredefineMatrix(sendPostData: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let postData = {
      preDeAppRoleMatId: sendPostData.preDeAppRoleMatId,
      workLineBusinessUnit: {
        businessUnitId: sendPostData.businessUnitId
      },
      worklineProduct: {
        productId: sendPostData.productId
      },
      workLineFunction: {
        worklineFunctionId: sendPostData.worklineFunctionId
      },
      worklineSubFunction: {
        worklineSubFunctionId: sendPostData.worklineSubFunctionId
      },
      workLineRole: {
        worklineRoleId: sendPostData.worklineRoleId
      },
      predefineApplRoleMatrixChildList: sendPostData.predefineApplRoleMatrixChildList,
      createdBy: sendPostData.createdBy
    };

    console.log(postData);

    /* let form = new FormData();
    form.append('action', sendPostData.action);
    form.append('userID', sendPostData.userID);
    form.append('comment', sendPostData.comment);
    form.append('vendorModId', sendPostData.vendorModifiedId);
    form.append('alf_ticket', sendPostData.alf_ticket); */

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/updatePredefineMatrix?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchPredefineMatrixForUser(userId) {

    let headers = new Headers();
    let form = new FormData();
    form.append('userId', userId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchPredefineMatrixForUser?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }


  insertUserApplicationRoleMapping(postData: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/insertUserApplicationRoleMapping?alf_ticket=' + this.ticket, postData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  approveRejectApproval(postData) {

    let headers = new Headers();
    let form = new FormData();
    form.append('preDeAppRoleMatId', postData.preDeAppRoleMatId);
    form.append('approvalUserName', postData.approvalUserName);
    form.append('comment', postData.comment);
    form.append('action', postData.action);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/' + postData.apiName + '?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  callApplicationAPI(postData) {

    let headers = new Headers();
    let form = new FormData();
    form.append('preDeAppRoleMatId', postData.preDeAppRoleMatId);
    form.append('callAPI', postData.callAPI);
    form.append('roleMatrixChildId', postData.roleMatrixChildId);
    form.append('userName', postData.userName);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/callApplicationAPI?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }


  fetchEmailDetailsForSendingEmail(roleMatrixChildId, preDeAppRoleMatId) {

    let headers = new Headers();
    let form = new FormData();
    form.append('preDeAppRoleMatId', preDeAppRoleMatId);
    form.append('roleMatrixChildId', roleMatrixChildId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/fetchEmailDetailsForSendingEmail?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }


  sendEmail(postData) {

    let headers = new Headers();
    let form = new FormData();
    form.append('preDeAppRoleMatId', postData.preDeAppRoleMatId);
    form.append('roleMatrixChildId', postData.roleMatrixChildId);
    form.append('emailId', postData.emailId);
    form.append('bodyMessage', postData.bodyMessage);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/sendEmail?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  getUserWorklineInformation(postData) {

    let headers = new Headers();
    let form = new FormData();
    form.append('preDeAppRoleMatId', postData.preDeAppRoleMatId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userCreationController/getUserWorklineInformation?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  downloadUserReport(sendPostData: any) {

    let api_url = 'fromDate=' + sendPostData.startDate + '&toDate=' + sendPostData.endDate + '&downloadType=' + sendPostData.reportType;

    window.open(environment.api_base_url_new + 'BranchCreation/userCreationController/downloadUserCreationReport?alf_ticket=' + this.ticket + '&' + api_url, '_blank');
  }
}
