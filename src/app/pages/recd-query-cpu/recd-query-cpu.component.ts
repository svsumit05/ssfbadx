import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { RecordmgmService } from '../../services/recordmgm.service';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';


@Component({
  selector: 'app-recd-query-cpu',
  templateUrl: './recd-query-cpu.component.html',
  styleUrls: ['./recd-query-cpu.component.css']
})
export class RecdQueryCpuComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  errorMsg: any;
  responceData: any;
  branchDropDown: any;

  datepickerOpts = {
    autoclose: true,
    todayHighlight: true,
    format: 'd-mm-yyyy'
  };

  fromDate = new Date();
  toDate = new Date();
  branch = '';
  recordTypeId = '';

  private currentUser: User = new User();

  constructor(private zone: NgZone, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => { });

  }

  ngOnInit(): void {

    this.branch = this.currentUser.user_extra_info.branch;

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRetrivalRecordPendingForCSU?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          recordTypeId: this.recordTypeId
          /* branchCode: this.branch,
          startDate: this._utilService.formateDateCommon(this.fromDate),
          endDate: this._utilService.formateDateCommon(this.toDate) */
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
        title: 'Document Type',
        data: 'branchDocumentRecord.documentType',
        render: (data, type, row) => {
          return data;
        }
      },
      {
        title: 'Account / SR No',
        data: 'branchDocumentRecord.acNo'
      },
      {
        title: 'CIF id',
        data: 'branchDocumentRecord.customerNo'
      },
      {
        title: 'Customer name',
        data: 'branchDocumentRecord.acTitle'
      },
      {
        title: 'File Barcode',
        data: 'branchDocumentRecord.fileBarcode'
      },
      {
        title: 'Carton Barcode',
        data: 'branchDocumentRecord.cartonBarcode'
      },
      {
        title: 'Physical Copy',
        data: 'isPhysicalCopyRequired',
        render: (data, type, row) => {
          if (row.isPhysicalCopyRequired == '1') {
            return 'Y';
          } else {
            return 'N';
          }
        }
      },
      {
        title: 'Document',
        data: 'documentName',
        render: (data, type, row) => {
          if (row.documentName != '') {
            return '<a target="_blank" href="' + environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/' + row.documentName + '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket + '">View Document</a>';
          } else {
            return '';
          }
        }
      },
      {
        title: 'Remarks',
        data: '',
        render: (data, type, row) => {
          let branchDocumentRecordRetrivalID = row.branchDocumentRecordRetrivalID;
          return '<textarea type="" class="form-control" id="remark_' + branchDocumentRecordRetrivalID + '"></textarea>';
        }
      },
      {
        title: 'Action',
        data: '',
        render: () => (data, type, row) => {
          return '<button type="button" class="btn btn-block approve-button">Accept</button>';
        }
      },
      {
        title: '',
        data: '',
        render: () => (data, type, row) => {
          return '<button type="button" class="btn btn-block reject-button">Reject</button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:nth-child(10)', row).unbind('click');
        $('td:nth-child(10)', row).bind('click', () => {
          this.updateRecordByCPUUser(data, 'APPROVED', row);
        });

        $('td:nth-child(11)', row).unbind('click');
        $('td:nth-child(11)', row).bind('click', () => {
          this.updateRecordByCPUUser(data, 'REJECTED', row);
        });
        return row;
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      this.dtOptions.ajax = {
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRetrivalRecordPendingForCSU?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          recordTypeId: this.recordTypeId
          /* branchCode: this.branch,
          startDate: this._utilService.formateDateCommon(this.fromDate),
          endDate: this._utilService.formateDateCommon(this.toDate) */
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      };

      this.dtTrigger.next();
    });
  }

  updateRecordByCPUUser(info: any, action, row): void {

    let remarks = document.getElementById('remark_' + info.branchDocumentRecordRetrivalID).value;



    if (remarks !== '') {

      let r = confirm('Are you sure!');
      if (r == true) {

        let sendData = {
          remarks: remarks,
          action: action,
          loggedInuserName: this.currentUser.userId,
          branchDocumentRecordretrivalID: info.branchDocumentRecordRetrivalID
        };

        this._recordMag.updateRetrivedRecordByCPU(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
          if (this.responceData.status == 200) {
            this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
            row.remove();
          } else {
            this.toastr.pop('error', 'Error', this.responceData.statusMessge);
          }
        });
      }

    } else {
      this.toastr.pop('warning', 'Warning', 'Please enter remarks');
    }
  }

}
