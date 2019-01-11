import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { DisbursementService } from '../../services/disbursement.service'
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';

@Component({
    selector: 'app-disbursement-report',
    templateUrl: './disbursement-report.component.html',
    styleUrls: ['./disbursement-report.component.css']
})
export class DisbursementReportComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    private currentUser: User = new User();

    workFlowStatus: {
        value: string;
        display: string;
    }[];

    noOfLoans: any;
    disbmtPhotoUrl: any;
    disbmtReceiptUrl: any;
    disbmtPhotoStatusList: any;
    centerName: any;
    centerId: any;
    branchName: any;
    branchId: any;
    date: any;
    id: any;
    srNo: any;

    message = '';
    errorMsg: string;
    worflowId: string;

    disb_from_date: any = new Date();
    disb_to_date: any = new Date();
    disb_branch: any = '';
    disb_status: any = '';
    _listingURL;
    _workflowSelected;
    sub: any;
    columns: any;
    columnDefs: any;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    branchDropDown: any;


    constructor(private route: ActivatedRoute, private router: Router, private _disbmtservice: DisbursementService, private _userServ: UserService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => { });
    }

    @ViewChild('dismbtPhotoDetailViewPopup') dismbtPhotoDetailViewPopup: Popup;


    someClickHandler(info: any): void {
        this.worflowId = info.id;
        this.getDetailRowInfo(info);
    }



    ngOnInit(): void {

        let fromDate = this.formatDate(this.disb_from_date, 0);
        let toDate = this.formatDate(this.disb_to_date, 0);

        this._listingURL = environment.api_base_url + 'alfresco/s/suryoday/disbursement/disbursementReport?alf_ticket=' + this.currentUser.ticket;

        this.columns = [
            {
                title: 'ID',
                data: 'id'
            },
            {
                title: 'Application No',
                data: 'sr_no',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            },
            {
                title: 'Branch Id',
                data: 'branch_id'
            },
            {
                title: 'Branch Name',
                data: 'branch_name'
            },
            {
                title: 'Center Id',
                data: 'center_Id'
            },
            {
                title: 'Center Name',
                data: 'center_name'
            },
            {
                title: 'No Of Loans',
                data: 'no_of_loan'
            },
            {
                title: 'Amount',
                data: 'amount'
            },
            {
                title: 'Staus',
                data: 'status'
            },
            {
                title: 'Disbmt Date',
                data: 'disb_date'
            },
            {
                title: 'Uploaded by',
                data: 'created_by'
            },
            {
                title: 'Verified by',
                data: 'approved_by'
            }];

        this.columnDefs = [{
            'targets': [0],
            'visible': false,
            'searchable': false
        }];

        this.dtOptions = {
            processing: true,
            serverSide: true,
            ordering: false,
            ajax: {
                url: this._listingURL,
                data: { fromDate: fromDate, toDate: toDate, branchName: 'All', requestedReportStatus: 'Approved' },
                method: 'POST',
            },
            columns: this.columns,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            },
            oLanguage: {
                sSearch: 'Global search',
                sZeroRecords: 'Use filters to get the records'
            },
            bFilter: false,
            searching: false,
            columnDefs: this.columnDefs
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

            let fromDate = this.formatDate(this.disb_from_date, 0);
            let toDate = this.formatDate(this.disb_to_date, 0);
            let branchName = this.disb_branch;
            let branchCode = this.disb_branch;
            let status = this.disb_status;

            this.dtOptions.ajax = {
                url: environment.api_base_url + 'alfresco/s/suryoday/disbursement/disbursementReport' + '?alf_ticket=' + this.currentUser.ticket,
                data: { fromDate: fromDate, toDate: toDate, branchName: branchName.branchName, branchCode: branchCode.branchCode, requestedReportStatus: status },
                method: 'POST',
            };
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }


    dismbtPhotoDetailView() {
        this._disbmtservice.getPendingTask(this.worflowId).subscribe(resdata => this.getDetailRowInfo(resdata), reserror => this.errorMsg = reserror);

    }

    getDetailRowInfo(responce) {
        this.id = responce.id;
        this.srNo = responce.sr_no;
        this.date = responce.disb_date;
        this.branchId = responce.branch_id;
        this.branchName = responce.branch_name;
        this.centerId = responce.center_Id;
        this.centerName = responce.center_name;
        this.noOfLoans = responce.no_of_loan;
        this.disbmtPhotoUrl = (responce.photo_location_id != '') ? environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/' + responce.photo_location_id + '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket : '';
        this.disbmtReceiptUrl = (responce.receipt_location_id != '') ? environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/' + responce.receipt_location_id + '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket : '';
        this.disbmtPhotoStatusList = responce.status;

        this.dismbtPhotoDetailViewPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Disbursement Details',
            widthProsentage: 95,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        }
        this.dismbtPhotoDetailViewPopup.show(this.dismbtPhotoDetailViewPopup.options);
    }

    saveWorkflowDetails() {
        this.dismbtPhotoDetailViewPopup.hide();
    }


    formatDate(date, prev_month) {

        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (prev_month > 0 && month > 1) {
            month = (parseInt(month) - 1)
        }


        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;


        return [year, month, day].join('-');
    }

    downloadReport() {
        let fromDate = this._utilService.formateDateYYMMDD(this.disb_from_date);
        let toDate = this._utilService.formateDateYYMMDD(this.disb_to_date);

        window.open(environment.api_base_url_new + 'BranchCreation/disbursmentController/downloadDisbursmentReport?branchName=' + this.disb_branch + '&fromDate=' + fromDate + '&toDate=' + toDate + '&requestedReportStatus=' + this.disb_status + '&alf_ticket=' + this.currentUser.ticket, '_blank');
    }




}
