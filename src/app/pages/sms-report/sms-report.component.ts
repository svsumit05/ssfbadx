import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { SmsTempService } from '../../services/sms-temp.service';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-sms-report',
  templateUrl: './sms-report.component.html',
  styleUrls: ['./sms-report.component.css']
})
export class SmsReportComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  private currentUser: User = new User();

  responceData;
  errorMsg: string;
  listingURL = '';
  columns = [];
  columnDefs = [];

  datepickerOpts = {
    autoclose: true,
    todayHighlight: true,
    format: 'd-mm-yyyy'
  };

  from_date: any = new Date();
  disableDate: any = new Date();

  temp_status = 'scheduled';
  tempDetails = [];
  startDate = '';
  startDateCondition = false;
  endDate = '';
  endDateCondition = false;

  @ViewChild('viewTemplate') viewTemplate: Popup;

  constructor(private route: ActivatedRoute, private router: Router, private smsService: SmsTempService, private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit(): void {

    let fromDate = this.formatDate(this.from_date);
    let status = this.temp_status;
    this.listingURL = environment.api_base_url_new + 'BranchCreation/TemplateController/fetchSchedulingmapping?alf_ticket=' + this.currentUser.ticket;

    this.columns = [{
      title: 'Template Name',
      data: 'templateName',
      render: function (data, type, row) {
        return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
      }
    },
    {
      title: 'Notification type',
      data: 'notificationType'
    },
    {
      title: 'Frequency',
      data: 'frequency'
    },
    {
      title: 'SMS Type',
      data: 'textType'
    },
    {
      title: 'Type',
      data: 'processingType'
    },
    {
      title: 'Action',
      data: '',
      render: function (data, type, row) {
        let isactive = row.templateScheduling.isActive;
        if (isactive == 'true') {
          return '<button>Deactivate</button>';
        }else {
          return '<button>Activate</button>';
        }
      }
    }];
    this.columnDefs = [
      {
        'targets': [-1],
        'data': null,
        'visible': true,
        'defaultContent': '<button>Deactivate</button>'
      }
    ];

    this.dtOptions = {
      ajax: {
        url: this.listingURL,
        data: { date: fromDate, type: status },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        },
        method: 'POST',
      },
      columns: this.columns,
      columnDefs: this.columnDefs,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td:first-child', row).unbind('click');
        $('td:first-child', row).bind('click', () => {
          self.someClickHandler(data);
        });
        $('td:last-child', row).unbind('click');
        $('td:last-child', row).bind('click', () => {
          self.deactClickHandler(data);
        });
        return row;
      },
      oLanguage: {
        sSearch: 'Global search',
        sZeroRecords: 'Use filters to get the records'
      },
      bFilter: true,
      searching: true
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    $.fn.dataTable.ext.errMode = 'none';
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      let fromDate = this.formatDate(this.from_date);
      let status = this.temp_status;

      this.dtOptions.ajax = {
        url: environment.api_base_url_new + 'BranchCreation/TemplateController/fetchSchedulingmapping?alf_ticket=' + this.currentUser.ticket,
        data: { date: fromDate, type: status },
        dataSrc: function (json) {
          let return_array = [];
          return_array = json;
          return return_array;
        },
        method: 'POST',
      };
      this.dtOptions.columns = this.columns;
      this.dtOptions.columnDefs = this.columnDefs;
      this.dtTrigger.next();
    });
  }

  deactClickHandler(info: any) {

    let fromdate = this.formatDate(this.from_date);

    let r = confirm('Are you sure to deactivate Template on ' + fromdate);
    if (r == true) {

      let sendPostData = {
        date: fromdate,
        templateId: info.templateId,
        isActive: (info.templateScheduling.isActive == 'true') ? 0 : 1;
      };

      this.smsService.updateSchedulingRecord(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

        if (this.responceData.status == 200) {
           this.toastr.pop('success', 'Success', this.responceData.statusMessge);
          this.rerender();
        } else {
           this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }

      });
    } else {

    }
  }

  someClickHandler(info: any) {
    this.tempDetails = info;

    this.startDate = this._utilService.convertToDateToString(info.startDate);
    this.endDate = this._utilService.convertToDateToString(info.endDate);

    let date1 = new Date(this.startDate);
    let date2 = new Date(this.endDate);
    let todayDate = new Date();


    if (+date1 >= +todayDate) {
      this.startDateCondition = false;
    } else {
      this.startDateCondition = true;
    }

    if (+date2 >= +todayDate) {
      this.endDateCondition = false;
    } else {
      this.startDateCondition = true;
    }

    this.viewTemplate.options = {
      color: '#363794',
      header: 'View Template',
      showButtons: false,
      confirmBtnContent: 'OK',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      widthProsentage: 100,
      animation: 'bounceInDown',
    };

    this.viewTemplate.show(this.viewTemplate.options);

  }

  closeviewTempDetails() {
    this.viewTemplate.hide();
    this.startDateCondition = false;
    this.endDateCondition = false;
    this.rerender();
  }

  formatDate(date) {
    let d = new Date(date);
    let month = (d.getMonth() + 1);
    let day = d.getDate();
    let year = d.getFullYear();
    return [day, month, year].join('-');
  }

}
