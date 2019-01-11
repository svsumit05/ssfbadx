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
  templateUrl: './user-matrix.component.html',
  styleUrls: ['./user-matrix.component.css']
})
export class UserMatrixComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData: any;

  WorklineBusinessUnitValue = '';
  WorklineBusinessUnitAPI: any;
  WorklineBusinessUnit: any = [];
  worklineProduct: any = [];

  WorklineBusinessProductUnit: any = [];
  WorklineBusinessUnitProductValue = '';

  worklineFunctionAPI: any;
  worklineFunctionList: any = [];
  WorklinefunctionValue = '';

  WorklineSubFunctionValue = '';
  WorklineSubFunctionList: any = [];

  ApplicationList: any;
  WorklineFunction: any;
  WorklineSubFunction: any;

  WorklineRole: any;
  WorklineRoleValue = '';


  ApplicationRoleList: any = [];
  ApplicationNameList: any = [];
  ApplicationAPIRes: any;
  ApplicationNameValue: any = [];
  ApplicationRoleValue: any = [];

  preDeAppRoleMatId: any;
  noOfApp = 1;


  @ViewChild('createMatrix') createMatrix: Popup;
  @ViewChild('editMatrix') editMatrix: Popup;
  @ViewChild('editWorklineMatrix') editWorklineMatrix: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private userMatrixService: UserMatrixService, private zone: NgZone, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


    this.userMatrixService.fetchAllWorklineBusinessUnit().subscribe(resdata => this.WorklineBusinessUnitAPI = resdata, () => { }, () => {

      this.WorklineBusinessUnitAPI.forEach(element => {
        let tempbusineesunit = {
          businessUnitName: element.businessUnitName,
          businessUnitId: element.businessUnitId,
          businessProduct: element.worklineProductList
        };
        this.WorklineBusinessUnit.push(tempbusineesunit);
      });

      this.userMatrixService.fetchAllWorklineFunction().subscribe(resdata => this.worklineFunctionAPI = resdata, () => { }, () => {

        this.worklineFunctionAPI.forEach(element => {
          let tempbusineesunit = {
            worklineFunctionName: element.worklineFunctionName,
            worklineFunctionId: element.worklineFunctionId,
            worklikneSubFunctionList: element.worklikneSubFunctionList
          };
          this.worklineFunctionList.push(tempbusineesunit);
        });


        this.userMatrixService.fetchAllWorklineRole().subscribe(resdata => this.WorklineRole = resdata, () => { }, () => {


          this.userMatrixService.fetchAllApplicationList().subscribe(resdata => this.ApplicationAPIRes = resdata, () => { }, () => {
            this.ApplicationAPIRes.forEach(element => {
              let appRole = {
                applicationId: element.applicationId,
                applicationName: element.applicationName,
                applicationRoleList: element.applicationRoleList
              };
              this.ApplicationNameList.push(appRole);
            });
          });

        });

      });

    });

  }

  ngOnInit() {

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllPredefineMatrixList?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {},
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      }, 
      columns: [/* {
        title: 'User Id',
        data: 'userId',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      }, */
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
        }],
      columnDefs: [],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          // self.editUserMatrix(data);
          self.updateWorklineMatrix(data);
        });

        /* $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          self.editUserMatrix(data);
        }); */
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
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }


  addUserMatrix() {
    this.createMatrix.options = {
      color: '#363794',
      header: 'Add Matrix',
      showButtons: false,
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this.createMatrix.show(this.createMatrix.options);
  }

  editUserMatrix(info: any): void {

    this.editMatrix.options = {
      color: '#363794',
      header: 'Edit Matrix',
      showButtons: false,
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this.editMatrix.show(this.editMatrix.options);
  }

  updateWorklineMatrix(info: any): void {

    this.editWorklineMatrix.options = {
      color: '#363794',
      header: 'Update Matrix',
      showButtons: false,
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    console.log(info);

    this.noOfApp = info.predefineApplRoleMatrixChildList.length;

    this.editWorklineMatrix.show(this.editWorklineMatrix.options);

    this.WorklineBusinessUnitValue = info.workLineBusinessUnit.businessUnitId;
    this.WorklineBusinessUnitProductValue = info.worklineProduct.productId;
    this.WorklinefunctionValue = info.workLineFunction.worklineFunctionId;
    this.WorklineSubFunctionValue = info.worklineSubFunction.worklineSubFunctionId;
    this.WorklineRoleValue = info.workLineRole.worklineRoleId;

    this.preDeAppRoleMatId = info.preDeAppRoleMatId;

    this.getWorklineSubFunction();
    this.getWorklineProduct();

    if (info.predefineApplRoleMatrixChildList != undefined) {
      info.predefineApplRoleMatrixChildList.forEach(element => {
        this.ApplicationNameValue.push(element.application.applicationId);
        this.ApplicationRoleValue.push(element.applicationRole.applicationRoleId);
      });
    }

    this.ApplicationNameValue.forEach(element => {
      this.editApplicationRole(element);
    });

  }

  closePopup() {
    this.createMatrix.hide();
    this.editWorklineMatrix.hide();
    this.resetData();
  }

  getWorklineProduct() {
    console.log(this.WorklineBusinessUnitValue);
    this.WorklineBusinessProductUnit = [];
    this.WorklineBusinessUnit.forEach(element => {
      if (element.businessUnitId == this.WorklineBusinessUnitValue) {
        this.WorklineBusinessProductUnit.push(element.businessProduct);
      }
    });

    this.WorklineBusinessProductUnit = this.WorklineBusinessProductUnit[0];
    console.log(this.WorklineBusinessProductUnit);
  }

  getWorklineSubFunction() {
    this.WorklineSubFunctionList = [];

    console.log(this.WorklinefunctionValue);

    this.worklineFunctionList.forEach(element => {
      if (element.worklineFunctionId == this.WorklinefunctionValue) {
        this.WorklineSubFunctionList.push(element.worklikneSubFunctionList);
      }
    });

    this.WorklineSubFunctionList = this.WorklineSubFunctionList[0];

  }

  editApplicationRole(feildCount) {
    let i = 0;
    this.ApplicationNameList.forEach(element => {
      if (element.applicationId == feildCount) {
        if (element.applicationRoleList != undefined) {
          this.ApplicationRoleList.push(element.applicationRoleList);
        }
      }
      i++;
    });

    console.log(this.ApplicationRoleList);
  }

  getApplicationRole(feildCount, empty = false) {

    console.log(feildCount);
    this.ApplicationRoleList[feildCount] = [];

    this.ApplicationNameList.forEach(element => {
      if (element.applicationId == this.ApplicationNameValue[feildCount]) {
        this.ApplicationRoleList[feildCount].push(element.applicationRoleList);
      }
    });
    this.ApplicationRoleList[feildCount] = this.ApplicationRoleList[feildCount][0];
    console.log(this.ApplicationRoleList);
  }


  saveMatrix() {


    console.log(this.ApplicationNameValue);
    console.log(this.ApplicationRoleValue);

    let predefineApplRoleMatrixChildListArray = [];

    for (let index = 0; index < this.ApplicationNameValue.length; index++) {

      let predefineApplRoleMatrixChildListObj1 = {
        application: {
          applicationId: this.ApplicationNameValue[index]
        }
      };


      let predefineApplRoleMatrixChildListObj2 = {
        applicationRole: {
          applicationRoleId: this.ApplicationRoleValue[index],
        }
      };

      let predefineApplRoleMatrixChildListObj = Object.assign(predefineApplRoleMatrixChildListObj1, predefineApplRoleMatrixChildListObj2);

      predefineApplRoleMatrixChildListArray.push(predefineApplRoleMatrixChildListObj);

    }

    let postdata = {
      businessUnitId: this.WorklineBusinessUnitValue,
      productId: this.WorklineBusinessUnitProductValue,
      worklineFunctionId: this.WorklinefunctionValue,
      worklineSubFunctionId: this.WorklineSubFunctionValue,
      worklineRoleId: this.WorklineRoleValue,
      predefineApplRoleMatrixChildList: predefineApplRoleMatrixChildListArray,
      createdBy: this.currentUser.userId
    };

    this.userMatrixService.insertPredefineMatrix(postdata).subscribe(resdata => this.responceData = resdata, () => { }, () => {
      if (this.responceData.status == '200') {
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.createMatrix.hide();
        this.rerender();
        this.resetData();
      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        this.createMatrix.hide();
        this.rerender();
        this.resetData();
      }
    });
  }

  editWorklineMatrixSubmit() {

    let predefineApplRoleMatrixChildListArray = [];

    for (let index = 0; index < this.ApplicationNameValue.length; index++) {

      let predefineApplRoleMatrixChildListObj1 = {
        application: {
          applicationId: this.ApplicationNameValue[index]
        }
      };


      let predefineApplRoleMatrixChildListObj2 = {
        applicationRole: {
          applicationRoleId: this.ApplicationRoleValue[index],
        }
      };

      let predefineApplRoleMatrixChildListObj = Object.assign(predefineApplRoleMatrixChildListObj1, predefineApplRoleMatrixChildListObj2);

      predefineApplRoleMatrixChildListArray.push(predefineApplRoleMatrixChildListObj);

    }

    let postdata = {
      businessUnitId: this.WorklineBusinessUnitValue,
      productId: this.WorklineBusinessUnitProductValue,
      worklineFunctionId: this.WorklinefunctionValue,
      worklineSubFunctionId: this.WorklineSubFunctionValue,
      worklineRoleId: this.WorklineRoleValue,
      predefineApplRoleMatrixChildList: predefineApplRoleMatrixChildListArray,
      createdBy: this.currentUser.userId,
      preDeAppRoleMatId: this.preDeAppRoleMatId
    };

    this.userMatrixService.updatePredefineMatrix(postdata).subscribe(resdata => this.responceData = resdata, () => { }, () => {
      if (this.responceData.status == '200') {
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.editWorklineMatrix.hide();
        this.rerender();
        this.resetData();
      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        this.editWorklineMatrix.hide();
        this.rerender();
        this.resetData();
      }
    });


  }

  resetData() {

    this.preDeAppRoleMatId = '';
    this.ApplicationNameValue = [];
    this.ApplicationRoleValue = [];
    this.noOfApp = 1;

    this.WorklineBusinessUnitValue = '';
    this.worklineProduct = [];
    this.WorklineBusinessProductUnit = [];
    this.WorklineBusinessUnitProductValue = '';
    this.WorklinefunctionValue = '';
    this.WorklineSubFunctionValue = '';
    this.WorklineSubFunctionList = [];
    this.ApplicationList = '';
    this.WorklineFunction = '';
    this.WorklineSubFunction = '';
    this.WorklineRoleValue = '';
    this.ApplicationRoleList = [];

  }

  addLink() {
    this.noOfApp = this.noOfApp + 1;
  }

  removeInput(feildCount) {
    console.log(feildCount);
    console.log(this.ApplicationNameValue);
    console.log(this.ApplicationRoleValue);
    this.ApplicationNameValue.splice(feildCount, 1);
    this.ApplicationRoleValue.splice(feildCount, 1);
    console.log(this.ApplicationNameValue);
    console.log(this.ApplicationRoleValue);
    this.noOfApp = this.noOfApp - 1;

    this.ApplicationNameValue.forEach(element => {
      this.getApplicationRole(element);
    });

  }

}
