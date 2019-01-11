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
  selector: 'app-recd-branch',
  templateUrl: './recd-query-branch.component.html',
  styleUrls: ['./recd-query-branch.component.css']
})
export class RecdQueryBranchComponent implements OnInit, AfterViewInit {

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
  columns = [];
  columnDefs = [];
  linkURL = '';
  actionType = '';

  private currentUser: User = new User();

  constructor(private zone: NgZone, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => { });

  }

  ngOnInit(): void {

    this.branch = this.currentUser.user_extra_info.branch;

    this.columns = [{
      title: 'Doc Type',
      data: 'branchDocumentRecord.documentType',
      render: (data, type, row) => {
        return data;
      }
    },
    {
      title: 'A/C / SR No',
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
      title: 'Action',
      data: '',
      render: (data, type, row) => {
        return '<button type="button" class="btn btn-default approve-button">Received</button>';
      }
    },
    {
      title: '',
      data: '',
      render: (data, type, row) => {
        return '';
      }
    },
    {
      title: 'Courier name',
      data: '',
      render: (data, type, row) => {
        let branchDocumentRecordRetrivalID = row.branchDocumentRecordRetrivalID;
        return '<textarea class="form-control" id="courier_' + branchDocumentRecordRetrivalID + '"></textarea>';
      }
    }, {
      title: 'AWB no',
      data: '',
      render: (data, type, row) => {
        let branchDocumentRecordRetrivalID = row.branchDocumentRecordRetrivalID;
        return '<textarea class="form-control" id="awbno_' + branchDocumentRecordRetrivalID + '"></textarea>';
      }
    }, {
      title: 'Date of dispatch',
      data: '',
      render: (data, type, row) => {
        let branchDocumentRecordRetrivalID = row.branchDocumentRecordRetrivalID;
        return '<input type="date" class="form-control" id="receiptdate_' + branchDocumentRecordRetrivalID + '">';
      }
    },
    {
      title: 'Action',
      data: '',
      render: (data, type, row) => {
        return '<button type="button" class="btn btn-default">SENT TO VENDOR</button>';
      }
    }];


    this.linkURL = environment.api_base_url_new + 'BranchCreation/recordController/fetchRetRecToUpdateAcceptanceStatusByBranchUser?alf_ticket=' + this.currentUser.ticket;

    this.dtOptions = {
      ajax: {
        url: this.linkURL,
        method: 'POST',
        data: {
          branchCode: this.branch,
          recordTypeId: this.recordTypeId
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: this.columns,
      columnDefs: this.columnDefs,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        return row;
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  rerender(source = null) {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      if (this.actionType == '1') {

        this.linkURL = environment.api_base_url_new + 'BranchCreation/recordController/fetchRetRecToUpdateAcceptanceStatusByBranchUser?alf_ticket=' + this.currentUser.ticket;

        this.columnDefs = [{
          'targets': [7],
          'visible': true,
          'searchable': true
        }, {
          'targets': [8],
          'visible': true,
          'searchable': true
        }, {
          'targets': [9],
          'visible': false,
          'searchable': false
        }, {
          'targets': [10],
          'visible': false,
          'searchable': false
        }, {
          'targets': [11],
          'visible': false,
          'searchable': false
        }, {
          'targets': [12],
          'visible': false,
          'searchable': false
        }];

      } else {

        this.linkURL = environment.api_base_url_new + 'BranchCreation/recordController/fetchRetRecToSendBackToVendorByBranchUser?alf_ticket=' + this.currentUser.ticket;

        this.columnDefs = [{
          'targets': [7],
          'visible': false,
          'searchable': false
        }, {
          'targets': [8],
          'visible': false,
          'searchable': false
        }, {
          'targets': [9],
          'visible': true,
          'searchable': true
        }, {
          'targets': [10],
          'visible': true,
          'searchable': true
        }, {
          'targets': [11],
          'visible': true,
          'searchable': true
        }, {
          'targets': [12],
          'visible': true,
          'searchable': true
        }];
      }

      this.dtOptions.columnDefs = this.columnDefs;
      console.log(this.recordTypeId);
      console.log(this.branch);

      this.dtOptions = {
        ajax: {
          url: this.linkURL,
          method: 'POST',
          data: {
            branchCode: this.branch,
            recordTypeId: this.recordTypeId
          },
          dataSrc: function (json) {
            let return_array = [];
            return_array = json;
            return return_array;
          }
        },
        columns: this.columns,
        columnDefs: this.columnDefs,
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;

          if (this.actionType == '1') {

            $('td:nth-child(8)', row).unbind('click');
            $('td:nth-child(8)', row).bind('click', () => {
              console.log(data);
              this.updateRetRecdToUpdateAcceptanceStatusByBranchUser(data, 'APPROVED', row);
            });

            $('td:nth-child(9)', row).unbind('click');
            $('td:nth-child(9)', row).bind('click', () => {
              // console.log(data);
              // this.updateRetRecdToUpdateAcceptanceStatusByBranchUser(data, 'REJECTED', row);
            });

          } else {

            $('td:last-child', row).unbind('click');
            $('td:last-child', row).bind('click', () => {
              this.sendRetrivalRecordBackToVendor(data, 'APPROVED', row);
            });

          }
        }
      };

      this.dtTrigger.next();
    });

    if (source == 'user') {
      this.recallfix();
    }

  }

  recallfix() {
    setTimeout(() => {
      this.rerender();
    }, 500);
  }

  updateRetRecdToUpdateAcceptanceStatusByBranchUser(info: any, action, row): void {

    var r = confirm('Are you sure!');
    if (r == true) {

      let sendData = {
        action: action,
        loggedInuserName: this.currentUser.userId,
        branchDocumentRecordretrivalID: info.branchDocumentRecordRetrivalID
      };

      console.log(sendData);

      this._recordMag.updateRetRecdToUpdateAcceptanceStatusByBranchUser(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          row.remove();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    }

  }

  sendRetrivalRecordBackToVendor(info: any, action, row): void {

    let courier = document.getElementById('courier_' + info.branchDocumentRecordRetrivalID).value;
    let awbno = document.getElementById('awbno_' + info.branchDocumentRecordRetrivalID).value;
    let receiptdate = document.getElementById('receiptdate_' + info.branchDocumentRecordRetrivalID).value;

    if (receiptdate != '' && awbno != '' && courier != '') {

      let r = confirm('Are you sure!');

      if (r == true) {

        let sendData = {
          branchDocumentRecordretrivalID: info.branchDocumentRecordRetrivalID,
          courier: courier,
          awbno: awbno,
          receiptdate: this._utilService.formateDateCommon(receiptdate)
        };

        this._recordMag.sendRetrivalRecordBackToVendor(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
          if (this.responceData.status == 200) {
            this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
            row.remove();
          } else {
            this.toastr.pop('error', 'Error', this.responceData.statusMessge);
          }
        });

        console.log(sendData);

      }
    } else {
      this.toastr.pop('warning', 'Warning', 'Please select Receipt date');
    }

  }

}
