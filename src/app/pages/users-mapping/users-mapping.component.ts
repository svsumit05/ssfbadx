import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UsersMasterService } from '../../services/users-master.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';

@Component({
  selector: 'app-users-mapping',
  templateUrl: './users-mapping.component.html',
  styleUrls: ['./users-mapping.component.css']
})
export class UsersMappingComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData;
  errorMsg;
  departmentList;

  userMappingData = {
    employeeId: '',
    role: {
      roleID: 0
    },
    department: {
      departmentId: 1
    }
  };

  @ViewChild('editUser') editUser: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private userMasterService: UsersMasterService, private zone: NgZone) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


    this.userMasterService.fetchAllDepartment().subscribe(resdata => this.departmentList = resdata, reserror => this.errorMsg = reserror, () => { });

  }

  ngOnInit(): void {
    this.dtOptions = {
      ajax: {
        url: environment.api_base_url + 'alfresco/s/suryoday/userModule/getAllUsers?alf_ticket=' + this.currentUser.ticket,
        method: 'GET',
      },
      columns: [{
        title: 'Emp ID',
        data: 'employeeId',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Branch',
        data: 'branch'
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          self.editUserMeta(data);
        });
        return row;
      },
      oLanguage:{
        sSearch: 'Global search'
      },
      searching: true
    };

  }

  editUserMeta(info: any): void {

    this.userMappingData.employeeId = info.employeeId;

    this.editUser.options = {
      color: '#363794',
      header: 'Edit User Info.',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this._userServ.getUserInformation(this.currentUser.ticket, info.employeeId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.department != null) {
        this.userMappingData.department.departmentId = this.responceData.department.departmentId;
      }
      if (this.responceData.department != null) {
        this.userMappingData.role.roleID = this.responceData.role.roleID;
      }
      this.editUser.show(this.editUser.options);

    });
  }



  onSubmitEditUserMeta(values) {
    this.userMasterService.updateUserInformation(this.userMappingData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      this.editUser.hide();
      this.rerender();
    });
  }

  closeEditMeta() {
    document.getElementById('editUserMetaForm').reset();
    this.editUser.hide();
    this.userMappingData = {
      employeeId: '',
      role: {
        roleID: 0
      },
      department: {
        departmentId: 1
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
