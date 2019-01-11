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
  selector: 'app-recd-vendor',
  templateUrl: './recd-vendor.component.html',
  styleUrls: ['./recd-vendor.component.css']
})
export class RecdVendorComponent implements OnInit, AfterViewInit {

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

  private currentUser: User = new User();

  constructor(private zone: NgZone, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService, private _vendorservice: VendorsService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
      this._vendorservice.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
    });
  }

  ngOnInit(): void {

    this.branch = this.currentUser.user_extra_info.branch;

    this.dtOptions = {
      ajax: {
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForVednor?alf_ticket=' + this.currentUser.ticket,
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
        title: 'CIF id',
        data: 'customerNo'
      }, {
        title: 'Customer Name',
        data: 'acTitle'
      }, {
        title: 'File barcode',
        data: '',
        render: (data, type, row) => {
          let branchDocumentRecordID = row.branchDocumentRecordID;
          console.log(row.fileBarcode);
          if (row.fileBarcode == null) {
            return '<input type="text" class="form-control" id="filebarcode_' + branchDocumentRecordID + '" >';
          } else {
            return '<input type="text" class="form-control" value="' + row.fileBarcode + '" id="filebarcode_' + branchDocumentRecordID + '" readonly>';
          }
        }
      }, {
        title: 'Carton barcode',
        data: '',
        render: (data, type, row) => {
          let branchDocumentRecordID = row.branchDocumentRecordID;
          console.log(row.cartonBarcode);
          if (row.cartonBarcode == null) {
            return '<input type="text" class="form-control" id="cartonbarcode_' + branchDocumentRecordID + '" >';
          } else {
            return '<input type="text" class="form-control" value="' + row.fileBarcode + '" id="filebarcode_' + branchDocumentRecordID + '" readonly>';
          }
        }
      }, {
        title: 'Action',
        data: '',
        render: (data, type, row) => {
          return '<button type="button" class="btn btn-block btn-primary">Receipts</button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          this.updateRecordByVendor(data, row);
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
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRecordPendingForVednor?alf_ticket=' + this.currentUser.ticket,
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

  updateRecordByVendor(info: any, row): void {

    let filebarcode = document.getElementById('filebarcode_' + info.branchDocumentRecordID).value;

    let cartonbarcode = document.getElementById('cartonbarcode_' + info.branchDocumentRecordID).value;

    console.log(filebarcode);
    console.log(filebarcode);

    if (filebarcode !== '' && cartonbarcode !== '') {

      let sendData = {
        branchDocumentRecordId: info.branchDocumentRecordID,
        receiptDate: this._utilService.formateDateCommon(new Date()),
        loggedInuserName: this.currentUser.userId,
        fileBarode: filebarcode,
        cartonBarcode: cartonbarcode,
      };

      this._recordMag.updateRecordByVendor(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          row.remove();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    } else {
      this.toastr.pop('warning', 'Warning', 'Please Enter file barcode and carton barcode');
    }



  }

}
