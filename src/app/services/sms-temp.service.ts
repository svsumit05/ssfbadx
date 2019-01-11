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
export class SmsTempService {

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

  isLOIAccepted(branchId: any) {

    let headers = new Headers();
    let sendPostData = {};
    return this._http.post(environment.api_base_url_new + 'BranchCreation/isLOIAccepted/' + branchId + '?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchConditionalParameterList(soureSystemId: any) {
    let headers = new Headers();
    let form = new FormData();
    form.append('soureSystemId', soureSystemId);
    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/fetchConditionalParameterList?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .delay(2000)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchFieldParameterList(soureSystemId) {
    let headers = new Headers();
    let form = new FormData();
    form.append('soureSystemId', soureSystemId);
    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/fetchFieldParameterList?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .delay(2000)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  addTemplate(sendPostData: any) {

    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/addTemplateModified?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  editTemplate(sendPostData: any) {

    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/editTemplateModified?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  fetchAllDepartment() {

    let sendPostData = {};
    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/Department/fetchAllDepartment?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchAllSourceSystem() {

    let sendPostData = {};
    let headers = new Headers();
    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/fetchAllSourceSystem?alf_ticket=' + this.ticket, sendPostData, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchAllUsers() {

    return this._http.get(environment.api_base_url + 'alfresco/s/suryoday/userModule/getAllUsers?alf_ticket=' + this.ticket)
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchDepartmentUser(departmentId: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('departmentId', departmentId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/fetchDepartmentUser?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  performTemplateApprovalAction(sendPostData) {

    let headers = new Headers();
    let form = new FormData();
    form.append('action', sendPostData.action);
    form.append('userID', sendPostData.userID);
    form.append('comment', sendPostData.comment);
    form.append('approvalUserRole', sendPostData.approvalUserRole);
    form.append('templateModId', sendPostData.templateModId);
    form.append('alf_ticket', sendPostData.alf_ticket);


    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/performTemplateApprovalAction?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  getUserInformation(userId) {

    let headers = new Headers();
    let form = new FormData();
    form.append('userName', userId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/getUserInformation?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchTemplateByUser(userId: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('userId', userId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/fetchTemplateByUser?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  fetchTemplateById(templateId: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('templateId', templateId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/fetchAlltemplate?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  uploadAdhockTemplate(sendPostData: any, file: any = null) {

    let headers = new Headers();
    let form = new FormData();

    form.append('uploadingFiles', file);
    form.append('templateId', sendPostData.templateId);
    form.append('uploadedBy', sendPostData.uploadedBy);
    form.append('adhockType', sendPostData.adhockType);
    form.append('scheduledDate', sendPostData.scheduledDate);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/uploadAdhockTemplate?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  copyTemplateModified(sendPostData: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('templateId', sendPostData.templateId);
    form.append('templateName', sendPostData.templateName);
    form.append('createdBy', sendPostData.createdBy);
    form.append('startDate', sendPostData.startDate);
    form.append('endDate', sendPostData.endDate);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/copyTemplateModified?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  checkTemplateNameExistance(text: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('templateName', text);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/checkTemplateNameExistance?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  updateSchedulingRecord(sendPostData: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('date', sendPostData.date);
    form.append('templateId', sendPostData.templateId);
    form.append('isActive', sendPostData.isActive);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/updateSchedulingRecord?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

  checkTemplatePresentForApproval(templateId: any) {

    let headers = new Headers();
    let form = new FormData();
    form.append('templateID', templateId);

    return this._http.post(environment.api_base_url_new + 'BranchCreation/TemplateController/checkTemplatePresentForApproval?alf_ticket=' + this.ticket, form, {
      headers: headers
    })
      .timeout(environment.set_timeout_sec)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

  }

}
