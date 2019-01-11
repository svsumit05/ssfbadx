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
  selector: 'app-recd-branchaction',
  templateUrl: './recd-query-branchaction.component.html',
  styleUrls: ['./recd-query-branchaction.component.css']
})
export class RecdQueryBranchactionComponent implements OnInit, AfterViewInit {

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
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRetRecToSendBackToVendorByBranchUser?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          branchCode: this.branch,
          recordTypeId: this.recordTypeId
          /* startDate: this._utilService.formateDateCommon(this.fromDate),
          endDate: this._utilService.formateDateCommon(this.toDate) */
        },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        }
      },
      columns: [{
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
        data: 'branchDocumentRecord.courierName'
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
        title: 'Date of Receipt',
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
          return '<button type="button" class="btn btn-block">SENT TO VENDOR</button>';
        }
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          this.sendRetrivalRecordBackToVendor(data, 'APPROVED', row);
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
        url: environment.api_base_url_new + 'BranchCreation/recordController/fetchRetRecToSendBackToVendorByBranchUser?alf_ticket=' + this.currentUser.ticket,
        method: 'POST',
        data: {
          branchCode: this.branch,
          recordTypeId: this.recordTypeId
          /* startDate: this._utilService.formateDateCommon(this.fromDate),
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

  sendRetrivalRecordBackToVendor(info: any, action, row) {

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

      }

    } else {
      this.toastr.pop('warning', 'Warning', 'Please select Receipt date');
    }

  }
}
