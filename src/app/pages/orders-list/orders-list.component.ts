import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-orders-list',
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    inventTypeSelected: any;
    validThresholdLimit: any;
    showDatePicker: any;
    showQuantityReceived = false;
    inventoryListDropDown: any;
    errorMsg: any;

    addorderDetails = {
        id: '',
        inventType: '',
        inventQuantity: '',
        inventRate: '',
        inventComment: ''
    }

    orderDetails = {
        id: '',
        inventType: '',
        inventQuantity: 0,
        inventQuantityDisp: 0,
        inventQuantityBal: 0,
        inventQuantityReceived: 0,
        inventRate: 0,
        inventComment: '',
        inventReqStatus: '',
        inventStatus: '',
        orderHStatus: '',
        inventReceivedDate: '',
    }

    private currentUser: User = new User();

    private _listingURL;
    private columns: any;
    private columnDefs: any;

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('orderInventoryPopup') orderInventoryPopup: Popup;
    @ViewChild('updateOrderInventoryPopup') updateOrderInventoryPopup: Popup;

    ngOnInit(): void {

        this.columns = [
            {
                title: 'ID',
                data: 'id',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            },
            {
                title: 'Type',
                data: 'inventoryType',
                render: function (data, type, row) {
                    return (row.inventorySubType) ? row.inventoryType + '(' + row.inventorySubType + ')' : row.inventoryType;
                }
            },
            {
                title: 'Quantity',
                data: 'quantity'
            },
            {
                title: 'Rate',
                data: 'rate'
            },
            {
                title: 'Total Quantity dispached',
                data: 'totalDispatch',
                render: function (data, type, row) {
                    return (row.totalDispatch == '') ? row.partialDispatch : (parseInt(row.partialDispatch, 10) + parseInt(row.totalDispatch, 10));
                }
            },
            {
                title: 'Order Status',
                data: 'orderStatus'
            },
            {
                title: 'Vendor',
                data: 'vendorName'
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

        this.columnDefs = [];

        this.dtOptions = {
            ajax: {
                url: environment.api_base_url + 'alfresco/s/suryoday/DLMS/getDlmsPendingTask?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
            },
            columns: this.columns,
            oLanguage: {
                sSearch: 'Global search'
            },
            searching: true,
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;


                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            },
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excel',
                    footer: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                },
                {
                    extend: 'pdf',
                    footer: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                },
                {
                    extend: 'print',
                    footer: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                }
            ]
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
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }


    someClickHandler(info: any): void {
        // this.message = info.id + ' - ' + info.firstName;
        this.orderDetails.id = info.id;
        this.orderDetails.inventType = info.inventoryType + ' ' + info.inventorySubType;
        this.orderDetails.inventQuantity = info.quantity;
        this.orderDetails.inventQuantityDisp = info.partialDispatch;
        this.orderDetails.inventQuantityBal = info.remainDispatch; // info.remainDispatch;
        this.orderDetails.inventRate = info.rate;
        // this.orderDetails.inventComment = info.HoComment;
        this.orderDetails.orderHStatus = info.orderStatus;
        // this.orderDetails.inventStatus = info.deliveryStatus;
        this.getDetailRowInfo(this.orderDetails);
    }



    getDetailRowInfo(responce) {

        this.updateOrderInventoryPopup.options = {
            color: '#363794',
            header: 'Update Order',
            showButtons: false,
            widthProsentage: 70,
            animation: 'bounceInDown',
        }
        this.updateOrderInventoryPopup.show(this.updateOrderInventoryPopup.options);

        setTimeout(() => {
            this.showDatePicker = true;
        }, 2000);

    }

    onOrderReset() {
        this.updateOrderInventoryPopup.hide();
        this.toastr.pop('warning', 'Cancelled', 'An operation is cancelled.');
    }

    onOrderUpdate(value: any) {
        if (this.orderDetails.inventStatus != '') {
            this.orderDetails.inventReceivedDate = this._utilService.formatDate(this.orderDetails.inventReceivedDate);
            this._orderInventService.updateOrderStatus(value.inventStatus, this.orderDetails).subscribe(() => { }, reserror => this.errorMsg = reserror, () => {
                this.updateOrderInventoryPopup.hide();
                this.toastr.pop('success', 'Successful', 'an order updated successfully.');
                this.rerender();
            });
        } else {
            this._orderInventService.giveOrderOutcome(this.orderDetails.inventReqStatus, this.orderDetails).subscribe(() => {

            }, reserror => this.errorMsg = reserror, () => {
                this.updateOrderInventoryPopup.hide();
                this.toastr.pop('success', 'Successful', 'an order updated successfully.');
                this.rerender();
            });
        }
    }

    changeOutcome(ev) {
        this.orderDetails.inventReqStatus = ev.target.value;
    }

    changeInventStatus(ev) {
        console.log(ev.target.value);
        if (ev.target.value == 'Partially Received') {
            this.showQuantityReceived = true;
        } else {
            this.showQuantityReceived = false;
        }
    }

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        endDate: 'today',
        format: 'd-mm-yyyy'
    }



}
