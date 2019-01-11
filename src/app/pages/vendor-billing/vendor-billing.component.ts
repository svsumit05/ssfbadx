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
    selector: 'app-vendor-billing',
    templateUrl: './vendor-billing.component.html',
    styleUrls: ['./vendor-billing.component.css']
})
export class VendorBillingComponent implements OnInit {

    orderReceivedDetails = {
        id: "",
        inventType: "",
        inventQuantity: 0,
        inventRate: 0,
        inventComment: "",
        orderStatus: "",
        excelNode: "",
        inputFile: "",
        inventInvoiceNo: "",
        inventAmount: 0
    };
    
    genBill = {
        invoiceNo:"",
        invoiceSelected:"",
        totalQuantity:0,
        totalAmount:0,
        productList:""
    }

    errorMsg: any;
    filter_from_date: any;
    filter_to_date: any;

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

    @ViewChild('createBillPopup') createBillPopup: Popup;
    @ViewChild('generateBillForm') generateBillForm: Popup;


    someClickHandler(info: any): void {

        this.orderReceivedDetails.id = info.id;
        this.orderReceivedDetails.inventType = info.inventoryType;
        this.orderReceivedDetails.inventQuantity = info.quantity;
        this.orderReceivedDetails.inventRate = info.rate;
        this.orderReceivedDetails.inventComment = info.coment;
        this.orderReceivedDetails.orderStatus = info.orderStatus;
        this.orderReceivedDetails.excelNode = info.excelNode;
        this.orderReceivedDetails.inventAmount = (parseInt(info.quantity) * parseInt(info.rate));
        this.getDetailRowInfo();
    }


    getDetailRowInfo() {

        this.createBillPopup.options = {
            cancleBtnClass: "btn btn-default",
            confirmBtnClass: "btn btn-mbe-attack",
            color: "#363794",
            header: "Create Bill",
            widthProsentage: 60,
            showButtons: false,
            animation: "bounceInDown",
            confirmBtnContent: "Submit"
        }
        this.createBillPopup.show(this.createBillPopup.options);

    }

    ngOnInit(): void {

        this._listingURL = environment.api_base_url + 'alfresco/s/suryoday/DLMS/getDlmsPendingTask?alf_ticket=' + this.currentUser.ticket;

        this.columns = [
            {
                title: '',
                data: ''
            },
            {
                title: 'ID',
                data: 'id',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            },
            {
                title: 'Type',
                data: "inventoryType",
                render: function (data, type, row) {
                    return (row.inventorySubType) ? row.inventoryType + '(' + row.inventorySubType + ')' : row.inventoryType;
                }
            },
            {
                title: 'Quantity',
                data: 'quantity'
            },
            {
                title: 'Delivery Status',
                data: 'orderStatus'
            },
            {
                title: 'Branch Name',
                data: 'branchName'
            },
            {
                title: 'Branch Code',
                data: 'branchName'
            },
            {
                title: 'Bill No',
                data: 'billNo'
            },
            {
                title: 'Amount To Be Paid',
                data: 'AmountTobePaid'
            },
            {
                title: 'Date Of Payment',
                data: 'dateOfPayment'
            }
        ];

        var rowData;
        this.dtOptions = {
            ajax: {
                url: this._listingURL,
                method: 'POST',
                data:{},
                dataSrc: function (json) {
                    let json = json;
                    json.recordsTotal = json.data.length;
                    json.recordsFiltered = json.data.length;
                    json.draw = json.data.draw;
                    var return_data = new Array();
                    for (var i = 0; i < json.data.length; i++) {
                        // json.data[i].deliveryStatus == 'Consumed'
                        if(json.data[i].partialDispatch > 0) {
                            return_data.push({
                                'id': json.data[i].id,
                                'inventoryType': json.data[i].inventoryType,
                                'inventorySubType': json.data[i].inventorySubType,
                                'quantity': json.data[i].quantity,
                                'comment': json.data[i].comment,
                                'HoComment': json.data[i].HoComment,
                                'vendorComment': json.data[i].vendorComment,
                                'orderDate': json.data[i].orderDate,
                                'branchName': json.data[i].branchName,
                                'orderStatus': json.data[i].orderStatus,
                                'billNo': json.data[i].billNo,
                                'invoiceNo': json.data[i].invoiceNo,
                                'amount': json.data[i].amount,
                                'billOutcome': json.data[i].billOutcome,
                                'systemDate': json.data[i].systemDate,
                                'receiveDate': json.data[i].receiveDate,
                                'courierDetail': json.data[i].courierDetail,
                                'excelNode': json.data[i].excelNode,
                                'deliveryStatus': json.data[i].deliveryStatus,
                                'partialDispatch': json.data[i].partialDispatch,
                                'totalDispatch': json.data[i].totalDispatch,
                                'remainDispatch': json.data[i].remainDispatch,
                                'invoiceExcel': json.data[i].invoiceExcel,
                                'rate': json.data[i].rate,
                                'AmountTobePaid': json.data[i].AmountTobePaid,
                                'modeOfPayment': json.data[i].modeOfPayment,
                                'detailOfPayment': json.data[i].detailOfPayment,
                                'dateOfPayment': json.data[i].dateOfPayment,
                                'orderUserName': json.data[i].orderUserName,
                                'HOApprover': json.data[i].HOApprover,
                                'dispatcheDate': json.data[i].dispatcheDate,
                                'vendorName': json.data[i].vendorName,
                                'accountUserName': json.data[i].accountUserName
                            })
                        }
                    }
                    return return_data;
                }
            },
            columns: this.columns,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td:nth-child(2)', row).unbind('click');
                $('td:nth-child(2)', row).bind('click', () => {
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
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                    }
                },
                {
                    extend: 'pdf',
                    footer: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                    }
                },
                {
                    extend: 'print',
                    footer: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                    }
                },
                {
                    text: 'Select All',
                    action: function () {
                        let table = $('table[id^="DataTables_Table_"]').DataTable();
                        table.rows().select();
                    }
                },
                {
                    text: 'Clear All',
                    action: function () {
                        let table = $('table[id^="DataTables_Table_"]').DataTable();
                        table.rows().deselect();
                    }
                },
                {
                    text: 'Generate Bill',
                    action: function () {
                        let table = $('table[id^="DataTables_Table_"]').DataTable();
                        var selectedData = table.rows({selected: true}).data().toArray();
                        sessionStorage.clear();

                        var activityIds = [];
                        var totalQuantity = 0;
                        var totalAmount = 0;
                        var prodcutList = [];

                        for (let item of selectedData) {
                            
                            let prodcutData = {};
                            prodcutData['inventoryType'] = item.inventoryType;
                            prodcutData['quantity'] = item.quantity;
                            prodcutData['rate'] = item.rate;
                            prodcutData['amount'] = item.amount;
                            prodcutList.push(prodcutData);
                            
                            activityIds.push(item.id);
                            totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
                            totalAmount = parseInt(totalAmount) + parseInt(item.amount);
                        }
                       
                        sessionStorage.setItem('activityIds', activityIds);
                        sessionStorage.setItem('totalQuantity', totalQuantity);
                        sessionStorage.setItem('totalAmount', totalAmount);
                        sessionStorage.setItem('productList', JSON.stringify(prodcutList));
                        document.getElementById('generateBillButton').click();
                    }
                }

            ],
            oLanguage: {
                sSearch: "Global search"
            },
            searching: true,            
            columnDefs: [
                {
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                }
            ],
            select: {
                style: 'os',
                selector: 'td:first-child'
            },
            //processing: true,
            //serverSide: true,
        };

    }

    ngAfterViewInit(): void {
        var rowData;
        this.dtTrigger.next();
        $.fn.dataTable.ext.errMode = 'none';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();

            let fromDate = this._utilService.formatDate(this.filter_from_date);
            let toDate = this._utilService.formatDate(this.filter_to_date);

            this.dtOptions.ajax = {
                url: environment.api_base_url + 'alfresco/s/sample/getTaskByDate?alf_ticket=' + this.currentUser.ticket + '&startDate=' + fromDate + '&endDate=' + toDate,
                method: 'GET',
                dataSrc: function (json) {
                    let json = json;
                    json.recordsTotal = json.data.length;
                    json.recordsFiltered = json.data.length;
                    json.draw = json.data.draw;
                    var return_data = new Array();
                    for (var i = 0; i < json.data.length; i++) {
                        // json.data[i].deliveryStatus == 'Consumed'
                        if(json.data[i].partialDispatch > 0) {
                            return_data.push({
                                'id': json.data[i].id,
                                'inventoryType': json.data[i].inventoryType,
                                'inventorySubType': json.data[i].inventorySubType,
                                'quantity': json.data[i].quantity,
                                'comment': json.data[i].comment,
                                'HoComment': json.data[i].HoComment,
                                'vendorComment': json.data[i].vendorComment,
                                'orderDate': json.data[i].orderDate,
                                'branchName': json.data[i].branchName,
                                'orderStatus': json.data[i].orderStatus,
                                'billNo': json.data[i].billNo,
                                'invoiceNo': json.data[i].invoiceNo,
                                'amount': json.data[i].amount,
                                'billOutcome': json.data[i].billOutcome,
                                'systemDate': json.data[i].systemDate,
                                'receiveDate': json.data[i].receiveDate,
                                'courierDetail': json.data[i].courierDetail,
                                'excelNode': json.data[i].excelNode,
                                'deliveryStatus': json.data[i].deliveryStatus,
                                'partialDispatch': json.data[i].partialDispatch,
                                'totalDispatch': json.data[i].totalDispatch,
                                'remainDispatch': json.data[i].remainDispatch,
                                'invoiceExcel': json.data[i].invoiceExcel,
                                'rate': json.data[i].rate,
                                'AmountTobePaid': json.data[i].AmountTobePaid,
                                'modeOfPayment': json.data[i].modeOfPayment,
                                'detailOfPayment': json.data[i].detailOfPayment,
                                'dateOfPayment': json.data[i].dateOfPayment,
                                'orderUserName': json.data[i].orderUserName,
                                'HOApprover': json.data[i].HOApprover,
                                'dispatcheDate': json.data[i].dispatcheDate,
                                'vendorName': json.data[i].vendorName,
                                'accountUserName': json.data[i].accountUserName
                            })
                        }
                    }
                    return return_data;
                }
            };
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

    generateBill(): void {

       this.genBill.invoiceSelected = sessionStorage.getItem('activityIds');
       this.genBill.totalQuantity = sessionStorage.getItem('totalQuantity');
       this.genBill.totalAmount = sessionStorage.getItem('totalAmount');
       this.genBill.productList = JSON.parse( sessionStorage.getItem('productList') );
       console.log(this.genBill.productList);
       
       this.generateBillForm.options = {
            cancleBtnClass: "btn btn-default",
            confirmBtnClass: "btn btn-mbe-attack",
            color: "#363794",
            header: "Create Bill",
            showButtons: false,
            widthProsentage: 70,
            animation: "bounceInDown",
            confirmBtnContent: "Submit"
        };

        this.generateBillForm.show(this.generateBillForm.options);
    }

    ordfileEvent(fileInput: any) {
        let file = fileInput.target.files[0];
        this.orderReceivedDetails.inputFile = file;
    }

    vendorBillConfirmEvent(ev) {
        let order_file_status;
        this._dlmsBillingService.createVendorBilling(this.orderReceivedDetails).subscribe((data) => {
            order_file_status = data.status_code;

        }, reserror => this.errorMsg = reserror, () => {
            if (order_file_status == '400') {
                this.toastr.pop('warning', 'Failed', 'Billing details Does not match with order details.');
            } else {
                this.createBillPopup.hide();
                this.toastr.pop('success', 'Successful', 'an bill generated successfully.');
                this.rerender();
            }
        });
        
    }

    vendorBillCancelEvent() {
         this.createBillPopup.hide();
    }

    generateBillFormSubmit(ev) {
        
        this._dlmsBillingService.generateVendorBilling(this.genBill).subscribe(() => {}, reserror => this.errorMsg = reserror, () => {
            this.generateBillForm.hide();
            this.toastr.pop('success', 'Successful', 'an invoice created successfully.');
            this.rerender();
        });
    }

    generateBillFormCancel() {
        this.generateBillForm.hide();
    }


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        endDate: 'today',
        format: 'd-mm-yyyy'
    }




}
