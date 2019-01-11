import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Subject';
import {Router, ActivatedRoute} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {UserService} from "../../services/user.service";
import {BranchService} from '../../services/branch.service';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';


@Component({
    selector: 'app-br-billing',
    templateUrl: './br-billing.component.html',
    styleUrls: ['./br-billing.component.css']
})
export class BrBillingComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any;
    private currentUser: User = new User();

    imgfirstURL: string;
    imgsecoundURL: string;

    addBillingParams = {
        branchId: '',
        branchPaymentReceipt: [],
        branchPaymentReceiptString: '',
        createdBy: ''
    }

    billingData = {
        billingId: '',
        branchId: '',
        createdBy: '',
        csoUser: '',
        csoAction: '',
        csoComment: '',
        ceoUser: '',
        ceoAction: '',
        ceoComment: '',
        ceoActionOn: '',
        billPaymentReceipt: ''
    }

    cso_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'CSO',
        billing_id: '',
    }

    ceo_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'MD',
        billing_id: '',
    }

    config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null,
        autoReset: 3000
    };
    
    branchId:string = '';
    
    columnDefs: any = [];


    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('viewBillingDetails') viewBillingDetails: Popup;
    @ViewChild('addBillingPopup') addBillingPopup: Popup;


    ngOnInit(): void {
        
        
        if (this._userServ.canCurrentUser('ADMIN_INFRA_TEAM')) {
            
            this.columnDefs = [{
                "targets": [6],
                "visible": true,
                "searchable": false
            }];

        } else if (this._userServ.canCurrentUser('CHIEF_SERVICE_OFFICER') || this._userServ.canCurrentUser('CHIEF_FINANCIAL_OFFICER') || this._userServ.canCurrentUser('BUSINESS_HEAD') || this._userServ.canCurrentUser('MD_AND_CEO')) {

             this.columnDefs = [{
                "targets": [6],
                "visible": false,
                "searchable": false
            }];


        }
        
        
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url_new + 'BranchCreation/getAllBranchReport' + '?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {},
                dataSrc: function (json) {
                    var return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'Branch Code',
                data: 'branchCode',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }                
            },{
                title: 'Branch Type',
                data: 'branchType'
            }, {
                title: 'Branch State',
                data: 'branchState'
            }, {
                title: 'Branch City',
                data: 'branchCity'
            }, {
                title: 'Branch Location',
                data: 'branchLocation'
            }, {
                title: 'Exp. Branch Opening Date',
                data: 'expBranchOpenDate'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    let row_title = "<a href='javascript:void(0);'><i class='fa fa-plus-circle' aria-hidden='true'></i> Add Billing details </a>";
                    return row_title;
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.viewBilling(data);
                });

                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.addBillingData(data);
                });

                return row;

            }

        };
    }

    viewBilling(info: any) {

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        this.viewBillingDetails.options = {
            color: "#363794",
            header: "View Billing Details",
            showButtons: false,
            widthProsentage: 100,
            animation: "bounceInDown",
        }
        
        this.branchId = info.branchId;

        this.branchServ.fetchAllBill(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            this.getBillingApporoval();
            this.viewBillingDetails.show(this.viewBillingDetails.options);
        });



    }

    getBillingApporoval() {

        for (let premises of this.responceData) {

            debugger;

            this.billingData.billPaymentReceipt = premises.billPaymentReceipt;

            this.cso_action = {
                action: '',
                prevAction: premises.csoAction || '',
                userID: this.currentUser.userId,
                comment: premises.csoComment,
                approvalUserRole: 'CSO',
                billing_id: premises.billingId
            }

            this.ceo_action = {
                action: '',
                prevAction: premises.ceoAction || '',
                userID: this.currentUser.userId,
                comment: premises.ceoComment,
                approvalUserRole: 'MD',
                billing_id: premises.billingId
            }

        }
    }


    addBillingData(info: any) {

        this.addBillingParams.branchId = info.branchId;
        this.addBillingParams.createdBy = this.currentUser.userId;

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;


        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.addBillingPopup.options = {
            color: "#363794",
            header: "Add Billing Details",
            showButtons: false,
            widthProsentage: 100,
            animation: "bounceInDown",
        }

        this.addBillingPopup.show(this.addBillingPopup.options);

    }



    saveBilling(value: any) {

        this.branchServ.saveBillingData(this.addBillingParams).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Layout Added Successfully.');
            this.addBillingPopup.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.ngVarReset();
            this.rerender();
        });

    }

    closeBilling() {
        this.ngVarReset();
        this.addBillingPopup.hide();
    }


    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

    onUploadSuccessinputFiles(ev: any, img_type: string) {
        let image_uuid = JSON.parse(ev[1]);

        if (img_type == 'branchPaymentReceipt') {
            this.addBillingParams.branchPaymentReceipt.push(image_uuid.data[0]);

            var branchPaymentReceipt = [];
            this.addBillingParams.branchPaymentReceiptString = '';

            if (this.addBillingParams.branchPaymentReceipt.length > 0) {

                for (let value of this.addBillingParams.branchPaymentReceipt) {
                    branchPaymentReceipt.push(Object.values(value));
                }

                this.addBillingParams.branchPaymentReceiptString = branchPaymentReceipt.join();
            }

        }

    }

    onUploadError(ev) {

    }

    saveUserAction(userAction: string) {

        let postString = '';


        if (userAction == 'cso_action') {

            postString = 'action=' + this.cso_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.cso_action.comment + '&approvalUserRole=' + this.cso_action.approvalUserRole + '&billing_id=' + this.cso_action.billing_id + '&branchId=' + this.branchId;
        }

        if (userAction == 'ceo_action') {

            postString = 'action=' + this.ceo_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.ceo_action.comment + '&approvalUserRole=' + this.ceo_action.approvalUserRole + '&billing_id=' + this.ceo_action.billing_id + '&branchId=' + this.branchId;

        }

        this.branchServ.billingActionPerform(postString).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Updated Successfully.');
            this.viewBillingDetails.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.ngVarReset();
            this.rerender();
        });

    }


    ngVarReset() {

        this.errorMsg = '';
        this.responceData = '';

        this.addBillingParams = {
            branchId: '',
            branchPaymentReceipt: [],
            branchPaymentReceiptString: '',
            createdBy: ''
        }

        this.billingData = {
            billingId: '',
            branchId: '',
            createdBy: '',
            csoUser: '',
            csoAction: '',
            csoComment: '',
            ceoUser: '',
            ceoAction: '',
            ceoComment: '',
            ceoActionOn: '',
            billPaymentReceipt: ''
        }

        this.cso_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'CSO',
            billing_id: '',
        }

        this.ceo_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'MD',
            billing_id: '',
        }


    }

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    }

}
