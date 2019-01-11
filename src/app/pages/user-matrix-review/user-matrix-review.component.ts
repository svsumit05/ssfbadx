import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { UserMatrixService } from '../../services/user-matrix.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-matrix-review.component.html',
  styleUrls: ['./user-matrix-review.component.css']
})
export class UserMatrixReviewComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData: any;
  emailResponceData = {
    status: '200',
    statusMessge: 'This is body text'
  };
  errorMsg: any;
  userApplRoleMatrixChildList: any;
  applRoleMatrixList: any;
  ApplicationNameList = [];
  ApplicationRoleList = [];
  ApplicationRoleValue: any = [];
  preDeAppRoleMatId = 0;
  roleMatrixChildId = 0;
  approvalStage = 'fetchUserApplRoleMatrixForAPICall';
  worklineData = {
    userFileBeanId: '',
    employeeId: '',
    employeeName: '',
    dateOfJoin: '',
    businessUnit: '',
    product: '',
    function: '',
    subFunction: '',
    designation: '',
    role: '',
    region: '',
    location: '',
    locType: '',
    functionAppraisarId: '',
    area: '',
    userCreatedInLDAP: '',
    emailID: '',
    isDefaultMatrixChanged: '',
    recordAction: '',
    recordStatus: '',
    initialApprovalOn: '',
    mobNo: ''
  };


  @ViewChild('editMatrix') editMatrix: Popup;
  @ViewChild('emailTemplate') emailTemplate: Popup;
  @ViewChild('viewWorkline') viewWorkline: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private userMatrixService: UserMatrixService, private zone: NgZone, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

  }

  ngOnInit() {

    let userId = this.currentUser.userId;

    // fetchUserApplRoleMatrixForInitialApproval
    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/fetchUserApplRoleMatrixForAPICall?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: { loggedInUserName: userId },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      }, 
      columns: [{
        title: 'User Id',
        data: 'userFileBean.employeeId',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      },
      {
        title: 'workLineBusinessUnit',
        data: 'workLineBusinessUnit.businessUnitName'
      },
      {
        title: 'worklineProduct',
        data: 'worklineProduct.productName'
      },
      {
        title: 'workLineFunction',
        data: 'workLineFunction.worklineFunctionName'
      },
      {
        title: 'worklineSubFunction',
        data: 'worklineSubFunction.worklineSubFunctionName'
      },
      {
        title: 'workLineRole',
        data: 'workLineRole.worklineRoleName'
      },
      {
        title: 'isDefaultMatrixChanged',
        data: 'userFileBean.isDefaultMatrixChanged',
        render: function (data, type, row) {
          if (row.userFileBean.isDefaultMatrixChanged == '1') {
            return 'YES';
          } else {
            return 'NO';
          }
        }
      }, {
        title: 'Workline info',
        data: '',
        render: function (data, type, row) {
          return '<button type="submit" class="btn btn-default">View Details</button>';
        }
      }],
      columnDefs: [],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          self.editUserMatrix(data);
        });

        $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          self.viewWorklineAction(data);
        });

        return row;
      },
      oLanguage: {
        sSearch: 'Global search'
      },
      searching: true
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      let userId = this.currentUser.userId;

      this.dtOptions.ajax = {
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/fetchUserApplRoleMatrixForAPICall?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: { loggedInUserName: userId },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      };

      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }


  editUserMatrix(info: any): void {

    this.preDeAppRoleMatId = info.preDeAppRoleMatId;

    this.userMatrixService.fetchAllApplicationList().subscribe(resdata => this.responceData = resdata, () => { }, () => {


      this.responceData.forEach(element => {
        let appRole = {
          applicationId: element.applicationId,
          applicationName: element.applicationName,
          applicationRoleList: element.applicationRoleList
        };
        this.ApplicationNameList.push(appRole);
      });

      this.userApplRoleMatrixChildList = info;

      if (this.userApplRoleMatrixChildList.userApplRoleMatrixChildList != undefined && this.userApplRoleMatrixChildList.userApplRoleMatrixChildList.length > 0) {
        this.applRoleMatrixList = this.userApplRoleMatrixChildList.userApplRoleMatrixChildList;
      }

      this.applRoleMatrixList.forEach(element => {
        this.getApplicationRole(element.application.applicationId);
      });


      this.editMatrix.options = {
        color: '#363794',
        header: 'User Application Matrix Review',
        showButtons: false,
        widthProsentage: 100,
        animation: 'bounceInDown',
      };

      this.editMatrix.show(this.editMatrix.options);

    });
  }

  getApplicationRole(feildCount) {
    this.ApplicationNameList.forEach(element => {
      if (element.applicationId == feildCount) {
        this.ApplicationRoleList.push(element.applicationRoleList);
      }
    });
  }

  closePopup() {
    this.editMatrix.hide();
    this.viewWorkline.hide();
    this.rerender();
  }

  resetData() {

  }

  callApplicationAPI(roleMatrixChildId, feildCount) {

    let callAPI = document.querySelector('input[name="callAPI_' + feildCount + '"]:checked').value;

    let post = {
      preDeAppRoleMatId: this.preDeAppRoleMatId,
      callAPI: callAPI,
      roleMatrixChildId: roleMatrixChildId,
      userName: this.currentUser.userId
    };

    this.userMatrixService.callApplicationAPI(post).subscribe(resdata => this.responceData = resdata, () => { }, () => {

      if (this.responceData.status == '200') {
        this.applRoleMatrixList[feildCount].isCreateOrUpdateAPIExecutedSuccesfully = 1;
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);

      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
      }

    });


  }

  getEmailDetails(roleMatrixChildId, feildCount) {

    this.emailTemplate.options = {
      color: '#363794',
      header: 'Add Email Details',
      showButtons: false,
      widthProsentage: 70,
      animation: 'bounceInDown',
    };

    this.roleMatrixChildId = roleMatrixChildId;

    this.userMatrixService.fetchEmailDetailsForSendingEmail(roleMatrixChildId, this.preDeAppRoleMatId).subscribe(resdata => this.emailResponceData = resdata, () => { }, () => {
      if (this.emailResponceData.status == '200') {
        this.emailTemplate.show(this.emailTemplate.options);

        setTimeout(() => {
          document.getElementById('feildCount').value = feildCount;
        }, 1000);

      } else {
        this.toastr.pop('warning', 'Warning', this.emailResponceData.statusMessge);
      }
    });

  }


  submitSendEmail() {

    let email_id = document.getElementById('email_id').value;
    let bodyMessage = document.getElementById('bodyMessage').value;
    let feildCount = document.getElementById('feildCount').value;

    let postData = {
      preDeAppRoleMatId: this.preDeAppRoleMatId,
      emailId: email_id,
      roleMatrixChildId: this.roleMatrixChildId,
      bodyMessage: bodyMessage
    };

    this.userMatrixService.sendEmail(postData).subscribe(resdata => this.emailResponceData = resdata, () => { }, () => {
      if (this.emailResponceData.status == '200') {
        this.applRoleMatrixList[feildCount].isEmailSent = 1;
        this.closeEmailPopup();
      } else {
        this.toastr.pop('warning', 'Warning', this.emailResponceData.statusMessge);
      }
    });
  }

  closeEmailPopup() {
    this.emailTemplate.hide();
    this.emailResponceData = {
      status: '200',
      statusMessge: 'This is body text'
    };
    this.roleMatrixChildId = 0;
  }

  viewWorklineAction(info: any): void {

    this.viewWorkline.options = {
      color: '#363794',
      header: 'Workline Details',
      showButtons: false,
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    let postData = {
      preDeAppRoleMatId: info.preDeAppRoleMatId
    };

    this.userMatrixService.getUserWorklineInformation(postData).subscribe(resdata => this.worklineData = resdata, () => { }, () => {
      this.viewWorkline.show(this.viewWorkline.options);
    });

  }

}
