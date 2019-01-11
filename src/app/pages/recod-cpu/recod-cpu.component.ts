import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { RecordmgmService } from '../../services/recordmgm.service';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-recod-cpu',
  templateUrl: './recod-cpu.component.html',
  styleUrls: ['./recod-cpu.component.css']
})
export class RecodCpuComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  errorMsg: any;
  responceData: any;
  branchDropDown: any;
  recordTypeDropDown: any;

  fromDate = new Date();
  toDate = new Date();
  branch = '';
  recordTypeId = '';

  datepickerOpts = {
    autoclose: true,
    todayHighlight: true,
    format: 'd-mm-yyyy'
  };

  columns = [];
  columnDefs = [];

  bulkupload = {
    uploadingFiles: '',
    uploadedBy: ''
  };

  private currentUser: User = new User();

  @ViewChild('uploadExcelView') uploadExcelView: Popup;

  constructor(private zone: NgZone, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService, private popup: Popup, private _vendorservice: VendorsService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
      this._vendorservice.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
    });
  }

  ngOnInit(): void {

    this.branch = this.currentUser.user_extra_info.branch;

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForCPU?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          branchCode: this.branch,
          startDate: this._utilService.formateDateCommon(this.fromDate),
          endDate: this._utilService.formateDateCommon(this.toDate),
          recordTypeId: this.recordTypeId
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
        title: 'Report Date',
        data: 'reportDate'
      }, {
        title: 'No of book',
        data: 'noOfBook'
      }, {
        title: 'Courier name',
        data: 'courierName'
      }, {
        title: 'AWB no',
        data: 'awbNo'
      }, {
        title: 'Ref Record ID',
        data: 'refBranchDocumentRecordId'
      }, {
        title: 'Date of Receipt',
        data: '',
        render: (data, type, row) => {
          let mindate = this._utilService.convertToDateToString(row.dispatchDate);
          let branchDocumentRecordID = row.branchDocumentRecordID;
          return '<input type="date" class="form-control" id="receiptdate_' + branchDocumentRecordID + '" min="' + mindate + '">';
        }
      }, {
        title: 'Action',
        data: '',
        render: () => (data, type, row) => {
          return '<button type="button" class="btn btn-block btn-primary">Send for record mgmt</button>';
        }
      }, {
        title: 'Action',
        data: '',
        render: () => (data, type, row) => {
          return '<button type="button" class="btn btn-block btn-primary">Reject</button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:nth-child(7)', row).unbind('click');
        $('td:nth-child(7)', row).bind('click', () => {
          this.updateRecordByCPUUser(data, row, 'SEND_TO_RECORD_MGMT');
        });

        $('td:nth-child(8)', row).unbind('click');
        $('td:nth-child(8)', row).bind('click', () => {
          this.updateRecordByCPUUser(data, row, 'REJECT');
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
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForCPU?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          branchCode: this.branch,
          startDate: this._utilService.formateDateCommon(this.fromDate),
          endDate: this._utilService.formateDateCommon(this.toDate),
          recordTypeId: this.recordTypeId
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

  updateRecordByCPUUser(info: any, row, action): void {

    let receiptdate = document.getElementById('receiptdate_' + info.branchDocumentRecordID).value;

    if (true) {

      let sendData = {
        branchDocumentRecordId: info.branchDocumentRecordID,
        receiptDate: this._utilService.formateDateCommon(receiptdate),
        loggedInuserName: this.currentUser.userId,
        action: action
      };

      this._recordMag.updateRecordByCPUUser(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          row.remove();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    } else {
      this.toastr.pop('warning', 'Warning', 'Please select Receipt date');
    }

  }

  uploadExcel() {

    this.uploadExcelView.options = {
      color: '#363794',
      header: 'Upload New Records.',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.uploadExcelView.show(this.uploadExcelView.options);

  }

  saveExcel() {
    this.bulkupload.uploadedBy = this.currentUser.userId;

    this._recordMag.bulkRecordUpload(this.bulkupload).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 200) {
        this.uploadExcelView.hide();
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.rerender();
        this.resetData();
      } else {
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      }
    });
  }

  ordfileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    this.bulkupload.uploadingFiles = file;
  }

  resetData() {
    this.bulkupload = {
      uploadingFiles: '',
      uploadedBy: ''
    };
  }

  onClose() {
    this.uploadExcelView.hide();
  }

}
