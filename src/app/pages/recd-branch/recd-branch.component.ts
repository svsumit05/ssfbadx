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
  selector: 'app-recd-branch',
  templateUrl: './recd-branch.component.html',
  styleUrls: ['./recd-branch.component.css']
})
export class RecdBranchComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  errorMsg: any;
  responceData: any;
  branchDropDown: any;
  documentDropDown: any;
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

  bulkupload = {
    uploadingFiles: '',
    uploadedBy: ''
  };

  addRecordData = {
    acNo: '',
    customerNo: '',
    branchCode: '',
    branchName: '',
    acTitle: '',
    acType: '',
    schemeCode: '',
    productName: '',
    acStat: '',
    acOpenDate: ''
  };

  fileData: any;
  addMoreCount = 1;

  private currentUser: User = new User();

  @ViewChild('addRecord') addRecord: Popup;
  @ViewChild('addSRRecordView') addSRRecordView: Popup;
  @ViewChild('addVoucherRecordView') addVoucherRecordView: Popup;
  @ViewChild('uploadExcelView') uploadExcelView: Popup;
  @ViewChild('downloadExcelView') downloadExcelView: Popup;
  @ViewChild('uploadUpdatedRecordsExcelView') uploadUpdatedRecordsExcelView: Popup;

  constructor(private zone: NgZone, private popup: Popup, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService, private _vendorservice: VendorsService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
      this._vendorservice.getDocumentList().subscribe(resdata => this.documentDropDown = resdata, () => { }, () => {
        this._vendorservice.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
      });
    });

  }

  ngOnInit(): void {

    this.branch = this.currentUser.user_extra_info.branch;
    this.addRecordData.branchCode = this.currentUser.user_extra_info.branch;
    this.addRecordData.branchName = this.currentUser.branch;

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForBranch?alf_ticket=' + this.currentUser.ticket,
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
        title: 'Document Type',
        data: 'documentType',
        render: (data, type, row) => {
          return data;
        }
      }, {
        title: 'Account / SR No',
        data: 'acNo'
      }, {
        title: 'CIF Id',
        data: 'customerNo'
      }, {
        title: 'Customer Name',
        data: 'acTitle'
      }, {
        title: 'Courier name',
        data: '',
        render: (data, type, row) => {
          return data;
          /* let branchDocumentRecordID = row.branchDocumentRecordID;
          return '<input type="text" class="form-control" id="courierName_' + branchDocumentRecordID + '">'; */
        }
      }, {
        title: 'AWB no',
        data: '',
        render: (data, type, row) => {
          return data;
          /* let branchDocumentRecordID = row.branchDocumentRecordID;
          return '<input type="text" class="form-control" id="awbNo_' + branchDocumentRecordID + '">'; */
        }
      }, {
        title: 'Date of Dispatch',
        data: '',
        render: (data, type, row) => {
          return data;
          /* let branchDocumentRecordID = row.branchDocumentRecordID;
          return '<input type="date" class="form-control" id="dispatchdate_' + branchDocumentRecordID + '">'; */
        }
      }, {
        title: 'Action',
        data: '',
        render: (data, type, row) => {
          return '<button type="button" class="btn btn-block btn-primary">Send to cpu</button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          this.updateRecordByBranchUser(data);
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
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForBranch?alf_ticket=' + this.currentUser.ticket,
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

  addNewRecord() {

    this.addRecord.options = {
      color: '#363794',
      header: 'Add New Record',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.addRecord.show(this.addRecord.options);

  }


  addSRRecord() {

    this.addSRRecordView.options = {
      color: '#363794',
      header: 'Add SR Record',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.addSRRecordView.show(this.addSRRecordView.options);

  }

  addVoucherRecord() {

    this.addVoucherRecordView.options = {
      color: '#363794',
      header: 'Add Voucher Record',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.addVoucherRecordView.show(this.addVoucherRecordView.options);

  }

  saveRecord() {

    let sendData = {
      acNo: this.addRecordData.acNo,
      customerNo: this.addRecordData.customerNo,
      branchCode: this.addRecordData.branchCode,
      branchName: this.addRecordData.branchName,
      acTitle: this.addRecordData.acTitle,
      acType: this.addRecordData.acType,
      schemeCode: this.addRecordData.schemeCode,
      documentType: this.addRecordData.productName,
      acStat: this.addRecordData.acStat,
      acOpenDate: this._utilService.formateDateCommon(this.addRecordData.acOpenDate),
    };

    this._recordMag.addNewRecord(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 200) {
        this.addRecord.hide();
        this.rerender();
        this.resetData();
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
      } else {
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      }
    });
  }

  updateRecordByBranchUser(info: any): void {

    let dispatchdate = document.getElementById('dispatchdate_' + info.branchDocumentRecordID).value;

    let courierName = document.getElementById('courierName_' + info.branchDocumentRecordID).value;

    let awbNo = document.getElementById('awbNo_' + info.branchDocumentRecordID).value;

    if (dispatchdate !== '' && courierName !== '' && awbNo !== '') {

      let sendData = {
        barcodeNo: info.barcodeNo,
        awbNo: awbNo,
        courierName: courierName,
        dispatchDate: this._utilService.formateDateCommon(dispatchdate),
        branchDocumentRecordID: info.branchDocumentRecordID,
      };

      this._recordMag.updateRecordByBranchUser(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          this.rerender();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    } else {
      this.toastr.pop('warning', 'Warning', 'Please select Dispatch date');
    }

  }

  onClose() {
    this.addRecord.hide();
    this.addSRRecordView.hide();
    this.addVoucherRecordView.hide();
    this.uploadExcelView.hide();
    this.downloadExcelView.hide();
    this.uploadUpdatedRecordsExcelView.hide();
    this.resetData();
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

  downloadViewExcel() {
    this.downloadExcelView.options = {
      color: '#363794',
      header: 'Download Records.',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.downloadExcelView.show(this.downloadExcelView.options);
  }

  uploadUpdatedExcel() {
    this.uploadUpdatedRecordsExcelView.options = {
      color: '#363794',
      header: 'Upload Updated Records.',
      showButtons: false,
      widthProsentage: 99,
      animation: 'bounceInDown',
    };
    this.uploadUpdatedRecordsExcelView.show(this.uploadUpdatedRecordsExcelView.options);
  }

  saveExcel() {

    this.bulkupload.uploadedBy = this.currentUser.userId;
    this.bulkupload.uploadingFiles = this.fileData;

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

  downloadExcel(values) {

    let postData = {
      branchCode: this.branch,
      startDate: this._utilService.formateDateCommon(values.startDate),
      endDate: this._utilService.formateDateCommon(values.endDate),
      recordTypeId: this._utilService.formateDateCommon(values.recordTypeId)
    };

    this._recordMag.downloadRecordPendingForBranch(postData);
  }

  saveUpdatedExcel(values) {

    let postData = {
      uploadingFiles: this.fileData,
      uploadedBy: this.currentUser.userId,
      recordTypeId: values.recordTypeId
    };

    this._recordMag.updateBulkRecord(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 200) {
        this.uploadUpdatedRecordsExcelView.hide();
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.resetData();
      } else {
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      }
    });
  }

  ordfileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    this.fileData = file;
  }

  addMore() {
    this.addMoreCount = this.addMoreCount + 1;
  }

  removeRow(i) {
    document.getElementById('v_' + i).style.display = 'none';
    document.getElementById('vDate_' + i).value = '';
    document.getElementById('vCount_' + i).value = '';
  }

  submitVoucher() {
    console.log(this.addMoreCount);

    for (let index = 0; index < this.addMoreCount; index++) {
      let vCount = document.getElementById('vCount_' + index).value;
      console.log(vCount);
    }

  }


  resetData() {

    this.fileData = '';

    this.bulkupload = {
      uploadingFiles: '',
      uploadedBy: ''
    };

    this.addRecordData = {
      acNo: '',
      customerNo: '',
      branchCode: '',
      branchName: '',
      acTitle: '',
      acType: '',
      schemeCode: '',
      productName: '',
      acStat: '',
      acOpenDate: ''
    };
  }

}
