import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { SmsTempService } from '../../services/sms-temp.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-temp-list',
  templateUrl: './temp-list.component.html',
  styleUrls: ['./temp-list.component.css']
})
export class TempListComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();
  userInformation;
  responceData;
  errorMsg;
  tempDetails = {
    templateId: 0,
    templateName: '',
    templateTypeId: 0,
    departmentId: 0,
    notificationType: '',
    frequency: '',
    processingType: '',
    textType: '',
    sourceSystemId: 0,
    isActive: '',
    messageText: '',
    scheduledDate: '',
    scheduledtime: '',
    templateType: {
      templateTypeid: 0,
      templateTypeName: '',
      isActive: 0
    },
    department: {
      departmentId: 0,
      departmentName: '',
      isActive: 0
    },
    sourceSystem: {
      sourceSystemid: 0,
      sourceSystemName: ''
    },
    dynamicList: [],
    conditionalParameterList: [],
    createdBy: '',
    createdOn: '',
    approvedBy: '',
    approvedOn: '',
    userRole: '',
    status: '',
    action: null,
    userList: null,
    startDate: null,
    endDate: null,
    responseEmailId: null,
    refTemplateModId: null,
    adhocType: null,
    queryCriteria: null,
    rejectionComment: null
  };
  templateComment;
  templateUrl: string;

  @ViewChild('viewTemplate') viewTemplate: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private smsService: SmsTempService, private zone: NgZone, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit(): void {

    let userId = this.currentUser.userId;
    this.smsService.getUserInformation(userId).subscribe(resdata => this.userInformation = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.userInformation.role == null) {
        this.toastr.pop('error', 'Error', 'Failed to get user information, Please Log a ticket to resolve the same.');
      }
    });

    this.templateUrl = 'BranchCreation/TemplateController/fetchPendingTemplateForApproval';

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + this.templateUrl + '?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          loggedInUserName: this.currentUser.userId,
          status: 'Pending'
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
        title: 'Template Name',
        data: 'templateName',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      }, {
        title: 'Frequency',
        data: 'frequency'
      }, {
        title: 'Department',
        data: 'department.departmentName',
        render: function (data, type, row) {
          return data;
        }
      }, {
        title: 'Message Type',
        data: 'textType',
        render: function (data, type, row) {
          return data;
        }
      }],
      columnDefs: [],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          self.viewTempDetails(data);
        });

        return row;
      },
      oLanguage: {
        sSearch: 'Global search'
      },
      searching: true
    };

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  viewTempDetails(info: any): void {
    this.tempDetails = info;

    this.tempDetails.startDate = this._utilService.convertToDateToString(info.startDate);
    this.tempDetails.endDate = this._utilService.convertToDateToString(info.endDate);

    this.viewTemplate.options = {
      color: '#363794',
      header: 'View Template',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };
    this.viewTemplate.show(this.viewTemplate.options);

  }

  closeviewTempDetails() {
    this.viewTemplate.hide();
    this.rerender();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  userAction(action, templateModId, comment) {

    let sendPostData = {
      action: action,
      userID: this.userInformation.employeeId || this.currentUser.userId,
      comment: comment.comment,
      approvalUserRole: this.userInformation.role.roleName || '',
      templateModId: templateModId,
      alf_ticket: this.currentUser.ticket
    };

    /* this.smsService.checkTemplatePresentForApproval(this.tempDetails.templateId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == '200') { */

    this.smsService.performTemplateApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

      if (this.responceData.status == '200') {
        this.toastr.pop('success', 'Success', this.responceData.statusMessge);
        this.viewTemplate.hide();
        this.rerender();
      } else {
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      }

    });

    /* } else {
      this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
    } */

  }



}
