import {AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {DisbursementService} from '../../services/disbursement.service'
import {Popup} from 'ng2-opd-popup';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {UserService} from '../../services/user.service';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-disbursement',
    styleUrls: ['./disbursement.component.css'],
    templateUrl: './disbursement.component.html'
})
export class DisbursementComponent implements OnInit, AfterViewInit {

    revisit = false;

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


    hasPermission = false;

    disb_from_date: any = new Date();
    disb_to_date: any = new Date();
    _listingURL;
    _workflowSelected;
    sub: any;
    columns: any;
    columnDefs: any;

    workflow_status: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };


    public config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        maxFilesize: '5',
        addRemoveLinks: true,
        autoReset: 30000
    };

    public config2: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        maxFilesize: '5',
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null
    };

    public config3: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        maxFilesize: '5',
        acceptedFiles: 'image/* , application/pdf',
        addRemoveLinks: true,
    };

    onUploadError(args: any) {

        if (args[1].message) {
            alert('Error : ' + args[1].message);
        } else {
            alert(args[1]);
        }
    }

    onUploadSuccess(args: any) {
        if (args[1].count) {
            let u_msg = 'Total Number of Records Uploaded is ' + args[1].count;
            alert(u_msg);
        }
    }

    constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private _disbmtservice: DisbursementService, private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    }

    @ViewChild('disbmtExcelUpload') disbmtExcelUpload: Popup;
    @ViewChild('dismbtPhotoDetailViewPopup') dismbtPhotoDetailViewPopup: Popup;


    someClickHandler(info: any): void {
        this.worflowId = info.id;
        this.getDetailRowInfo(info);
    }

    deleteRowHandler(row: any, info: any): void {
        this.hasPermission = this._userServ.canCurrentUser('DISBMT_EXECUTIVE_OPERATIONS');
        if (this.hasPermission) {

            this._disbmtservice.deleteDisbmtWorkflow(info.id).subscribe(resdata => resdata, reserror => this.errorMsg = reserror, () => {
                row.remove(); // remove current tr 
                this.toastr.pop('success', 'Successful', 'an record deleted successfully.');
            });

        }
    }

    ngOnInit(): void {
        // when calling routes change
        let id = (this.route.snapshot.url[0].path || 'Upload');

        this._workflowSelected = id;
        this.revisit = true;

        this.hasPermission = this._userServ.canCurrentUser('DISBMT_EXECUTIVE_OPERATIONS');


        if (this._workflowSelected == 'Upload' && this.hasPermission) {

            this._listingURL = environment.api_base_url + 'alfresco/s/suryoday/disbursement/getUploadedRecord?alf_ticket=' + this.currentUser.ticket;

            this.columns = [{
                title: 'ID',
                data: 'id'
            }, {
                title: 'Application No',
                data: 'sr_no',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Branch Id',
                data: 'branch_id'
            }, {
                title: 'Branch Name',
                data: 'branch_name'
            }, {
                title: 'Center Id',
                data: 'center_Id'
            }, {
                title: 'Center Name',
                data: 'center_name'
            }, {
                title: 'No Of Loans',
                data: 'no_of_loan'
            }, {
                title: 'Disbmt Date',
                data: 'disb_date'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    return data;
                }
            }];
            this.columnDefs = [{
                'targets': [0],
                'visible': false,
                'searchable': false
            }, {
                'targets': [-1],
                'data': null,
                'visible': true,
                'defaultContent': '<button>Delete</button>'
            }];


        } else {

            this._listingURL = environment.api_base_url + 'alfresco/s/suryoday/disbursement/getPendingTask?alf_ticket=' + this.currentUser.ticket;

            this.columns = [{
                title: 'ID',
                data: 'id'
            }, {
                title: 'Application No',
                data: 'sr_no',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Branch Id',
                data: 'branch_id'
            }, {
                title: 'Branch Name',
                data: 'branch_name'
            }, {
                title: 'Center Id',
                data: 'center_Id'
            }, {
                title: 'Center Name',
                data: 'center_name'
            }, {
                title: 'No Of Loans',
                data: 'no_of_loan'
            }, {
                title: 'Staus',
                data: 'status'
            }, {
                title: 'Disbmt Date',
                data: 'disb_date'
            }];
            this.columnDefs = [{
                'targets': [0],
                'visible': false,
                'searchable': false
            }];

        }

        let fromDate = this.formatDate(this.disb_from_date, 0);
        let toDate = this.formatDate(this.disb_to_date, 0);

        this.dtOptions = {
            processing: true,
            serverSide: true,
            ordering: false,
            ajax: {
                url: this._listingURL,
                method: 'POST',
                data: {fromDate: fromDate, toDate: toDate},
                timeout: environment.set_timeout_sec
            },
            columns: this.columns,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                $('td:last-child', row).unbind('click');
                $('td:last-child', row).bind('click', () => {
                    self.deleteRowHandler(row, data);
                });

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
            searching: false,
            bFilter: false,
            columnDefs: this.columnDefs
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
        $.fn.dataTable.ext.errMode = 'none';
    }

    rerender(): void {

        this.hasPermission = this._userServ.canCurrentUser('DISBMT_EXECUTIVE_OPERATIONS');
        if (this.hasPermission) {

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();

                let fromDate = this.formatDate(this.disb_from_date, 0);
                let toDate = this.formatDate(this.disb_to_date, 0);

                this.dtOptions.ajax = {
                    url: environment.api_base_url + 'alfresco/s/suryoday/disbursement/getUploadedRecord' + '?alf_ticket=' + this.currentUser.ticket,
                    method: 'POST',
                    data: {fromDate: fromDate, toDate: toDate},
                    timeout: environment.set_timeout_sec
                };
                // Call the dtTrigger to rerender again
                this.dtTrigger.next();
            });

        } else {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();

                let fromDate = this.formatDate(this.disb_from_date, 0);
                let toDate = this.formatDate(this.disb_to_date, 0);

                this.dtOptions.ajax = {
                    url: environment.api_base_url + 'alfresco/s/suryoday/disbursement/getPendingTask' + '?alf_ticket=' + this.currentUser.ticket,
                    method: 'POST',
                    data: {fromDate: fromDate, toDate: toDate},
                    timeout: environment.set_timeout_sec
                };
                // Call the dtTrigger to rerender again
                this.dtTrigger.next();
            });
        }
    }



    rerendergetAllTaskByInitiator(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();

            const fromDate = this.formatDate(this.disb_from_date, 0);
            let toDate = this.formatDate(this.disb_to_date, 0);

            this.dtOptions.ajax = {
                url: environment.api_base_url + 'alfresco/s/suryoday/disbursement/getUploadedRecord' + '?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {fromDate: fromDate, toDate: toDate},
                timeout: environment.set_timeout_sec
            };
            this.dtTrigger.next();
        });
    }

    dismbtOpenExcelUpload() {

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDisbursementFile?alf_ticket=' + this.currentUser.ticket;

        this.disbmtExcelUpload.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Upload Disbursement File',
            widthProsentage: 50,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.disbmtExcelUpload.show(this.disbmtExcelUpload.options);
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

        this.workFlowStatus = [
            {value: 'Approved', display: 'Verified'},
            {value: 'Rejected', display: 'Send back to Branch'}
        ];



        this.config2.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadPhoto?alf_ticket=' + this.currentUser.ticket + '&disbursementId=' + this.id;

        this.config3.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadReceipt?alf_ticket=' + this.currentUser.ticket + '&disbursementId=' + this.id;

        this.dismbtPhotoDetailViewPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Disbursement Details',
            widthProsentage: 95,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.dismbtPhotoDetailViewPopup.show(this.dismbtPhotoDetailViewPopup.options);

    }

    onInput($event) {
    }

    onworkFlowStatusChange(wfs: any) {
        this._disbmtservice.updateDisbmtWorkflowStatus(this.worflowId, wfs).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
            //  this.toastr.pop('success', 'Success', 'Verified Sucessfully.');
        });

    }


    saveWorkflowDetails() {
        this.dismbtPhotoDetailViewPopup.hide();
        this.rerender();
    }

    saveExcelDetails() {
        this.disbmtExcelUpload.hide();
        this.rerendergetAllTaskByInitiator();
    }



    ngOnDestroy(): void {
        this.revisit = false;
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


}
