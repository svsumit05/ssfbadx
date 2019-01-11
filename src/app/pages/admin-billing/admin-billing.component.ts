import {AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {DlmsBillingService} from '../../services/dlms-billing.service'
import {Popup} from 'ng2-opd-popup';
import {UserService} from "../../services/user.service";
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';


@Component({
  selector: 'app-admin-billing',
  templateUrl: './admin-billing.component.html',
  styleUrls: ['./admin-billing.component.css']
})
export class AdminBillingComponent implements OnInit {

    showDatePicker:any
    
    orderReceivedDetails = {
        billNo: "",
        totalAmount: 0,
        inventAmountToPaid: 0,
        inventAmountToDeduct: 0,
        inventAmountToAdd: 0,
        inventAmountToSub: 0,
        inventData: "",
        inventStatus:"",
        inventDatePayment:"",
        inventModePayment:"",
        inventDetailPayment:"",
    };
    
    errorMsg: any;
    private currentUser: User = new User();
    private _listingURL;
    private columns: any;
    private columnDefs: any;

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _dlmsBillingService: DlmsBillingService, private toastr: ToasterService, private _utilService: UtilitiesHelper) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('updateBillPopup') updateBillPopup: Popup;


    someClickHandler(info: any): void {

        this.orderReceivedDetails.billNo = info.billNo;
        

        this._dlmsBillingService.getTaskByBillId(this.orderReceivedDetails.billNo).subscribe(resdata => this.orderReceivedDetails.inventData = resdata, reserror => this.errorMsg = reserror, () => {
            
            let totalAmount = 0;
            for (let item of this.orderReceivedDetails.inventData.data) {
                totalAmount = parseInt(totalAmount) + parseInt(item.amount); 
            }
            
            this.orderReceivedDetails.totalAmount = totalAmount;//info.totalAmount;
            this.orderReceivedDetails.inventAmountToPaid = totalAmount; //info.totalAmount;
            this.getDetailRowInfo();
        });

    }

    getDetailRowInfo() {

        this.updateBillPopup.options = {
            cancleBtnClass: "btn btn-default",
            confirmBtnClass: "btn btn-mbe-attack",
            color: "#363794",
            header: "Update Billing Details",
            widthProsentage: 60,
            showButtons:false,
            animation: "bounceInDown",
            confirmBtnContent: "Submit"
        }
        this.updateBillPopup.show(this.updateBillPopup.options);
        
        setTimeout( () => {
            this.showDatePicker = true;
        }, 1000);

    }

    ngOnInit(): void {

        this._listingURL = environment.api_base_url + 'alfresco/s/suryoday/getInvoiceNo?alf_ticket=' + this.currentUser.ticket;

        this.columns = [
            {
                title: 'Bill No',
                data: 'billNo',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }
        ];


        this.dtOptions = {
            ajax: {
                url: this._listingURL,
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
            // Declare the use of the extension in the dom parameter
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excel',
                    footer: true,
                    exportOptions: {
                        columns: [1]
                    }
                },
                {
                    extend: 'pdf',
                    footer: true,
                    exportOptions: {
                        columns: [1]
                    }
                },
                {
                    extend: 'print',
                    footer: true,
                    exportOptions: {
                        columns: [1]
                    }
                }
            ],
            oLanguage: {
                sSearch: "Global search"
            },
            searching: true
            //processing: true,
            //serverSide: true,
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

            this.dtOptions.ajax = {
                url: environment.api_base_url + 'alfresco/s/suryoday/getInvoiceNo?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
            };
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }


    adminBillConfirmEvent() {

        this.orderReceivedDetails.inventDatePayment = this._utilService.formatDate(this.orderReceivedDetails.inventDatePayment);
        this._dlmsBillingService.updateAdminPayment(this.orderReceivedDetails).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Payment Mode updated Successfully.');
        }, reserror => this.errorMsg = reserror, () => {
            this.updateBillPopup.hide();
            this.rerender();
        });
        
    }

    adminBillCancelEvent() {
         this.updateBillPopup.hide();
    }
    
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    }
    
    




}

