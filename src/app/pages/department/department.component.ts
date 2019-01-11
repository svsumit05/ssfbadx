import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData;
  errorMsg;

  departmentValues = {
    departmentId: '',
    departmentName: '',
    isActive: ''
  };

  @ViewChild('addDepartment') addDepartment: Popup;
  @ViewChild('editDepartment') editDepartment: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private depService: DepartmentService, private zone: NgZone) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit(): void {
    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/Department/fetchAllDepartment?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {},
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
        title: 'Sr No.',
        data: 'departmentId',
        render: function (data, type, row) {
          return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
        }
      }, {
        title: 'Department Name',
        data: 'departmentName'
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.editNewDepartment(data);
        });
        return row;
      }
    };


  }

  editNewDepartment(info: any): void {
    this.departmentValues.departmentId = info.departmentId;
    this.departmentValues.departmentName = info.departmentName;
    this.departmentValues.isActive = info.isActive;

    this.editDepartment.options = {
      color: '#363794',
      header: 'Edit New Department',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this.editDepartment.show(this.editDepartment.options);

  }

  addNewDepartment(info: any): void {

    this.addDepartment.options = {
      color: '#363794',
      header: 'Add New Department',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this.addDepartment.show(this.addDepartment.options);


  }

  onSubmitAddDep(values) {
    this.depService.addDepartment(values).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      this.addDepartment.hide();
      this.rerender();
    });
  }

  onSubmitEditDep(values) {
    this.depService.editDepartment(this.departmentValues).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      this.editDepartment.hide();
      this.rerender();
    });
  }

  closeDepPop() {
    this.addDepartment.hide();
    this.editDepartment.hide();
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
