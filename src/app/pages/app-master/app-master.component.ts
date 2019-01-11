import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-app-master',
  templateUrl: './app-master.component.html',
  styleUrls: ['./app-master.component.css']
})
export class AppMasterComponent implements AfterViewInit, OnDestroy, OnInit {

  appMasterData = {
    applicationId: 0,
    applicationName: '',
    createdBy: '',
    isActive: 0,
    isAPIAvailable: '',
    isEmailAvailable: '',
    lastUpdatedBy: '',
    status: '',
    appOwnerId: ''
  };

  errorMsg = '';
  responceData: any;

  private currentUser: User = new User();


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private toastr: ToasterService, private _applicationservice: ApplicationService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  @ViewChild('applicationAddPopup') applicationAddPopup: Popup;

  ngOnInit(): void {

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/userCreationController/fetchAllApplication?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: '',
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
        title: 'Application Name',
        data: 'applicationName',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      }, {
        title: 'API',
        data: 'isAPIAvailable',
        render: function (data, type, row) {
          if (row.isAPIAvailable == '0') {
            return 'Not Available';
          } else {
            return 'Available';
          }
        }
      }, {
        title: 'Email',
        data: 'isEmailAvailable',
        render: function (data, type, row) {
          if (row.isEmailAvailable == '0') {
            return 'Not Available';
          } else {
            return 'Available';
          }
        }
      }],
      columnDefs: [],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:nth-child(1)', row).unbind('click');
        $('td:nth-child(1)', row).bind('click', () => {
          self.someClickHandler(data);
        });

        return row;
      },

    };

  }

  addApplicationSubmit() {

    if (this.appMasterData.status == 'ADD') {

      this.appMasterData.createdBy = this.currentUser.userId;

      this._applicationservice.addApplication(this.appMasterData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == '200') {
          this.toastr.pop('success', 'Success', this.responceData.statusMessge);
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
        this.applicationAddPopup.hide();
        this.rerender();
      });

    } else {


      this.appMasterData.lastUpdatedBy = this.currentUser.userId;

      this._applicationservice.updateApplication(this.appMasterData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == '200') {
          this.toastr.pop('success', 'Success', this.responceData.statusMessge);
          this.applicationAddPopup.hide();
          this.rerender();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    }

  }

  someClickHandler(info: any): void {

    this.appMasterData.applicationId = info.applicationId;
    this.appMasterData.appOwnerId = info.appOwnerId;
    this.appMasterData.applicationName = info.applicationName;
    this.appMasterData.isAPIAvailable = (info.isAPIAvailable == '1') ? true : false;
    this.appMasterData.isEmailAvailable = (info.isEmailAvailable == '1') ? true : false;
    this.appMasterData.isActive = (info.isActive == '1') ? true : false;
    this.appMasterData.status = 'EDIT';

    this.applicationAddPopup.options = {
      cancleBtnClass: 'btn btn-default',
      confirmBtnClass: 'btn btn-mbe-attack',
      color: '#363794',
      header: 'Update Application Details',
      widthProsentage: 99,
      showButtons: false,
      animation: 'bounceInDown',
      confirmBtnContent: 'Submit'
    };

    this.applicationAddPopup.show(this.applicationAddPopup.options);
  }

  closeForm() {
    this.applicationAddPopup.hide();
    this.resetData();
  }

  addApplication() {
    this.appMasterData.status = 'ADD';
    this.applicationAddPopup.options = {
      cancleBtnClass: 'btn btn-default',
      confirmBtnClass: 'btn btn-mbe-attack',
      color: '#363794',
      header: 'Add Application Details',
      widthProsentage: 99,
      showButtons: false,
      animation: 'bounceInDown',
      confirmBtnContent: 'Submit'
    };

    this.applicationAddPopup.show(this.applicationAddPopup.options);

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      this.dtTrigger.next();
    });
  }

  resetData() {
    this.appMasterData = {
      applicationId: 0,
      applicationName: '',
      createdBy: '',
      isActive: 0,
      isAPIAvailable: '',
      isEmailAvailable: '',
      lastUpdatedBy: '',
      status: '',
      appOwnerId: ''
    };

    this.errorMsg = '';
    this.responceData = '';
  }

  checkboxAPIValidation(element) {

    let isEmailAvailable = document.getElementById('isEmailAvailable').checked;

    if (isEmailAvailable == true) {
      document.getElementById('isEmailAvailable').checked = false;
    }

  }

  checkboxEMAILValidation(element) {

    let isAPIAvailable = document.getElementById('isAPIAvailable').checked;

    if (isAPIAvailable == true) {
      document.getElementById('isAPIAvailable').checked = false;
    }
  }

}
