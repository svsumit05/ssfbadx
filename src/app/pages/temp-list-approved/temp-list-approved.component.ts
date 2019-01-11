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
  selector: 'app-temp-list-approved',
  templateUrl: './temp-list-approved.component.html',
  styleUrls: ['./temp-list-approved.component.css']
})
export class TempListApprovedComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();
  userInformation;
  responceData;
  errorMsg;
  tempDetails = {
    templateModId: 0,
    templateName: '',
    templateTypeId: '',
    departmentId: '',
    notificationType: '',
    frequency: '',
    processingType: '',
    textType: '',
    sourceSystemId: 0,
    isActive: 1,
    messageText: '',
    scheduledDate: '',
    scheduledtime: null,
    templateType: {
      templateTypeid: 0,
      templateTypeName: '',
      isActive: 1
    },
    department: {
      departmentId: 0,
      departmentName: '',
      isActive: 1
    },
    sourceSystem: {
      sourceSystemid: 0,
      sourceSystemName: ''
    },
    dynamicList: [],
    conditionalParameterList: [],
    createdBy: '',
    createdOn: null,
    approvedBy: null,
    approvedOn: null,
    userRole: null,
    status: null,
    action: null,
    templateId: null,
    lastUpdatedBy: null,
    lastUpdatedOn: null,
    userList: null,
    startDate: '',
    endDate: '',
    responseEmailId: null,
    refTemplateModId: null,
    rejectionComment: null
  };
  templateUrl: string;
  copyTempValues = {
    createdBy: '',
    templateId: '',
    templateName: ''
  };
  startDateCondition = false;
  endDateCondition = false;
  startDate;
  endDate;

  @ViewChild('viewTemplate') viewTemplate: Popup;
  @ViewChild('copyTemplate') copyTemplate: Popup;

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

    this.templateUrl = 'BranchCreation/TemplateController/fetchTemplateStatusWise';

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + this.templateUrl + '?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          status: 'Approved'
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
      },
      {
        title: 'Frequency',
        data: 'frequency'
      },
      {
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
      },
      {
        title: 'Action',
        data: '',
        render: function (data, type, row) {
          return data;
        }
      },
      {
        title: 'Action',
        data: '',
        render: function (data, type, row) {
          return data;
        }
      }],
      columnDefs: [
        {
          'targets': [-1],
          'data': null,
          'visible': true,
          'defaultContent': '<button>Edit</button>'
        },
        {
          'targets': [-2],
          'data': null,
          'visible': true,
          'defaultContent': '<button>Copy</button>'
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          self.viewTempDetails(data);
        });

        $('td:nth-child(5)', row).unbind('click');
        $('td:nth-child(5)', row).bind('click', () => {
          self.copyTempDetails(data);
        });

        $('td:nth-child(6)', row).unbind('click');
        $('td:nth-child(6)', row).bind('click', () => {
          self.editTempDetails(data);
        });

        return row;
      },
      oLanguage: {
        sSearch: 'Global search'
      },
      searching: true,
      responsive: true
    };

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  viewTempDetails(info: any): void {
    this.tempDetails = info;
    this.startDate = this._utilService.convertToDateToString(info.startDate);
    this.endDate = this._utilService.convertToDateToString(info.endDate);

    let date1 = new Date(this.startDate);
    let date2 = new Date(this.endDate);
    let todayDate = new Date();


    if (+date1 >= +todayDate) {
      this.startDateCondition = false;
    } else {
      this.startDateCondition = true;
    }

    if (+date2 >= +todayDate) {
      this.endDateCondition = false;
    } else {
      this.startDateCondition = true;
    }

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

  copyTempDetails(info: any): void {

    this.copyTempValues.templateId = info.templateId;

    this.copyTemplate.options = {
      color: '#363794',
      header: 'Copy Template',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };
    this.copyTemplate.show(this.copyTemplate.options);
  }

  editTempDetails(info: any): void {

    let startDate = this._utilService.convertToDateToString(info.startDate);

    let date1 = new Date(startDate);

    let todayDate = new Date();

    if (+date1 >= +todayDate) {

      this.smsService.checkTemplatePresentForApproval(info.templateId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == '200') {

          let infoValue = JSON.stringify(info);
          sessionStorage.setItem('edit_temp_' + info.templateId, infoValue);
          this.router.navigate(['/sms/edit-template', info.templateId]);

        } else {
          this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        }
      });

    } else {

      this.toastr.pop('warning', 'warning', 'Template started, Edit is not allowed.');

    }

  }

  onCopySubmit(values) {

    let sendPostData = {
      createdBy: this.currentUser.userId,
      templateId: this.copyTempValues.templateId,
      templateName: values.templateName,
      startDate: this._utilService.convertToDate(values.startDate),
      endDate: this._utilService.convertToDate(values.endDate)
    };

    this.smsService.checkTemplatePresentForApproval(this.copyTempValues.templateId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == '200') {
        this.smsService.copyTemplateModified(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
          if (this.responceData.status == 200) {
            this.toastr.pop('success', 'Success', this.responceData.statusMessge);
            this.copyTemplate.hide();
            this.rerender();
          } else {
            this.toastr.pop('error', 'Error', this.responceData.statusMessge);
          }
        });
      } else {
        this.copyTemplate.hide();
        this.rerender();
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
      }
    });
  }

  closeviewTempDetails() {
    this.viewTemplate.hide();
    this.copyTemplate.hide();
    this.startDateCondition = false;
    this.endDateCondition = false;
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

  userAction(action, templateModId) {

    let sendPostData = {
      action: action,
      userID: this.userInformation.employeeId || this.currentUser.userId,
      comment: action,
      approvalUserRole: this.userInformation.role.roleName,
      templateModId: templateModId,
      alf_ticket: this.currentUser.ticket
    };

    this.smsService.performTemplateApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      this.rerender();
      this.viewTemplate.hide();
    });

  }

  checkTemplateNameExistance(event) {
    let text = event.target.value;

    this.smsService.checkTemplateNameExistance(text).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 400) {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        document.getElementById('templateName').value = '';
      }
    });
  }

  updateTemp(values) {
    this.tempDetails.startDate = this._utilService.convertToDate(this.startDate);
    this.tempDetails.endDate = this._utilService.convertToDate(this.endDate);
    this.tempDetails.lastUpdatedBy = this.currentUser.userId;
    this.tempDetails.userRole = this.userInformation.role.roleID;

    this.smsService.editTemplate(this.tempDetails).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 400) {
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      } else {
        this.viewTemplate.hide();
        this.rerender();
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.router.navigate(['/template-list']);
      }
    });

  }

}
