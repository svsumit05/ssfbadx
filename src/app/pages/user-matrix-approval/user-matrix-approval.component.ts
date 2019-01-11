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
  selector: 'app-user-matrix',
  templateUrl: './user-matrix-approval.component.html',
  styleUrls: ['./user-matrix-approval.component.css']
})
export class UserMatrixApprovalComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData: any;
  errorMsg: any;
  userApplRoleMatrixChildList: any;
  applRoleMatrixList: any;
  ApplicationNameList = [];
  ApplicationRoleList = [];
  ApplicationRoleValue: any = [];
  preDeAppRoleMatId = 0;
  approvalStage = 'fetchUserApplRoleMatrixForInitialApproval';
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
  @ViewChild('viewWorkline') viewWorkline: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private userMatrixService: UserMatrixService, private zone: NgZone, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

  }

  ngOnInit() {

    let userId = this.currentUser.userId;

    // fetchUserApplRoleMatrixForInitialApproval
    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/' + this.approvalStage + '?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: { userName: userId },
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
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/' + this.approvalStage + '?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: { userName: userId },
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

      // this.userApplRoleMatrixChildList = this.userApplRoleMatrixChildList[0];

      console.log(this.userApplRoleMatrixChildList);

      if (this.userApplRoleMatrixChildList.userApplRoleMatrixChildList != undefined && this.userApplRoleMatrixChildList.userApplRoleMatrixChildList.length > 0) {
        this.applRoleMatrixList = this.userApplRoleMatrixChildList.userApplRoleMatrixChildList;
      }

      this.applRoleMatrixList.forEach(element => {
        this.getApplicationRole(element.application.applicationId);
      });

      this.editMatrix.options = {
        color: '#363794',
        header: 'User Application Matrix Approval',
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
  }

  resetData() {

  }

  submitUserApplRoleMatrixApproval(action) {
    let apiName = '';

    if (this.approvalStage == 'fetchUserApplRoleMatrixForInitialApproval') {
      apiName = 'approveRejectIntialApproval';
    } else {
      apiName = 'approveRejectFinalApproval';
    }

    let post = {
      preDeAppRoleMatId: this.preDeAppRoleMatId,
      approvalUserName: this.currentUser.userId,
      comment: action,
      action: action,
      apiName: apiName
    };

    this.userMatrixService.approveRejectApproval(post).subscribe(resdata => this.responceData = resdata, () => { }, () => {

      if (this.responceData.status == '200') {
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.editMatrix.hide();
        this.rerender();
      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        this.editMatrix.hide();
        this.rerender();
      }

    });

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
