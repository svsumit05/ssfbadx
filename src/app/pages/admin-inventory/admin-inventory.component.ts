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
import { BranchService } from '../../services/branch.service';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-admin-inventory',
    templateUrl: './admin-inventory.component.html',
    styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    inventoryListDropDown: any;
    branchDropDown: any = [];
    vendorDropDown: any = [];
    courierDropDown: any = [];
    errorMsg: any;
    responceData: any;

    approvedInvData = {
        orderIndentId: null,
        inventory: {
            inventoryId: null,
            vendorId: null,
            itemName: null,
            thresholdLimit: null,
            ratePerUnit: null,
            gst: null,
            isActive: null,
            createdBy: null,
            createdOn: null,
            approvedBy: null,
            approvedOn: null,
            lastUpdatedBy: null,
            lastUpdatedOn: null
        },
        quantityRequired: null,
        dlmsBranchMaster: {
            dlmsBranchId: null,
            branchCode: null,
            branchName: null,
            branchAddress: null,
            city: null,
            state: null,
            country: null,
            contactDetails: null,
            courierServicable: null,
            isActive: null,
            createdBy: null,
            createdOn: null,
            lastUpdatedBy: null,
            lastUpdatedOn: null
        },
        createdBy: null,
        createdOn: null,
        approvalStatus: null,
        approvedBy: null,
        approvedOn: null,
        comment: null,
        orderNo: null,
        roleId: null,
        indentOrderStatus: null
    };

    iInventoryData = [];
    updateInvData = [];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOptsArray = [];
    fromDate = new Date();
    toDate = new Date();


    private currentUser: User = new User();
    private _listingURL;
    private columns: any;
    private columnDefs: any;
    navID: string;
    private sub: any;
    adminData = [];

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private vendorServ: VendorsService) {

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.vendorServ.getVendorsList().subscribe(resdata => this.vendorDropDown = resdata, () => { }, () => {
            this.vendorServ.getCourierList().subscribe(resdata => this.courierDropDown = resdata, () => { }, () => { });
        });

    }

    @ViewChild('viewInventoryPopup') viewInventoryPopup: Popup;

    ngOnInit(): void {
        setTimeout(() => {
            this._listingURL = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchPendingIndentRecordsForVendorProcessing?alf_ticket=' + this.currentUser.ticket;


            this.columns = [
                {
                    title: 'Order No',
                    data: 'orderNo',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                    }
                },
                {
                    title: 'Inventory Name',
                    data: 'inventory.itemName'
                },
                {
                    title: 'Branch Code',
                    data: 'dlmsBranchMaster.branchCode'
                },
                {
                    title: 'Quantity',
                    data: 'quantityRequired'
                },
                {
                    title: 'Rate',
                    data: 'inventory.ratePerUnit'
                },
                {
                    title: 'Vendor',
                    data: '',
                    render: (data, type, row) => {
                        let vendorList = '<select class="form-control" id="vendor_' + row.inc_id + '"><option value="">Select Vendor</option>';
                        if (this.vendorDropDown.length > 0) {
                            this.vendorDropDown.forEach(element => {
                                vendorList += '<option value="' + element.vendorId + '">' + element.vendorName + '</option>';
                            });
                        }
                        vendorList += '</select>';
                        return vendorList;
                    },
                    orderable: false
                },
                {
                    title: 'Courier',
                    data: '',
                    render: (data, type, row) => {
                        let courier = '<select class="form-control" id="courier_' + row.inc_id + '"><option value="">Select Courier</option>';
                        if (this.courierDropDown.length > 0) {
                            this.courierDropDown.forEach(element => {
                                courier += '<option value="' + element.courierId + '">' + element.courierName + '</option>';
                            });
                        }
                        courier += '</select>';
                        return courier;
                    },
                    orderable: false
                },
                {
                    title: 'Comment',
                    data: '',
                    render: function (data, type, row) {
                        return '<textarea id="comment_' + row.inc_id + '" class="form-control" rows="3"></textarea>';
                    },
                    orderable: false
                },
                {
                    title: 'Action',
                    data: '',
                    render: function (data, type, row) {
                        return '<button type="button" class="btn btn-block btn-success btn-flat">Approve</button>';
                    },
                    orderable: false
                },
                {
                    title: '',
                    data: '',
                    render: function (data, type, row) {
                        return '<button type="button" class="btn btn-block btn-danger btn-flat">Reject</button>';
                    },
                    orderable: false
                }
            ];

            this.columnDefs = [
                { width: 100, targets: 0 },
                { width: 100, targets: 1 },
                { width: 100, targets: 2 },
                { width: 100, targets: 3 },
                { width: 150, targets: 4 },
                { width: 150, targets: 5 },
                { width: 200, targets: 6 },
                { width: 100, targets: 7 },
                { width: 100, targets: 8 }
            ];

            this.dtOptions = {
                ajax: {
                    url: this._listingURL,
                    method: 'POST',
                    data: {},
                    dataSrc: function (json) {
                        let return_array = [];
                        return_array = json;
                        if (return_array.length > 0) {
                            let i = 0;
                            return_array.forEach(element => {
                                return_array[i].inc_id = i;
                                i++;
                            });
                        }
                        return return_array;
                    }
                },
                columns: this.columns,
                searching: true,
                columnDefs: this.columnDefs,
                rowCallback: (row: Node, data: any[] | Object, index: number) => {
                    const self = this;

                    $('td:first-child', row).unbind('click');
                    $('td:first-child', row).bind('click', () => {
                        self.someClickHandler(data);
                    });

                    $('td:nth-child(9)', row).unbind('click');
                    $('td:nth-child(9)', row).bind('click', () => {
                        this.userAction_new(row, data, 'APPROVED');
                    });

                    $('td:nth-child(10)', row).unbind('click');
                    $('td:nth-child(10)', row).bind('click', () => {
                        this.userAction_new(row, data, 'REJECTED');
                    });
                    return row;
                },
                dom: 'lfrtip',
                oLanguage: {
                    sSearch: 'Global Search'
                }
            };
        }, 500);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.dtTrigger.next();
            $.fn.dataTable.ext.errMode = 'none';
        }, 900);
    }

    someClickHandler(info: any): void {

        this.approvedInvData = info;

        this.viewInventoryPopup.options = {
            color: '#363794',
            header: 'View Order',
            showButtons: false,
            widthProsentage: 99,
            animation: 'bounceInDown',
        };

        this._orderInventService.fetchOrderIndentTransByOrderInv(info.orderIndentId).subscribe(resdata => this.iInventoryData = resdata, reserror => this.errorMsg = reserror, () => {

            this.viewInventoryPopup.show(this.viewInventoryPopup.options);
            this.updateInvData = this.iInventoryData;

            this.iInventoryData.forEach(element => {
                if (element.userAction != null) {
                    element.isActionDone = 1;
                } else {
                    element.isActionDone = 0;
                }

                let dispatchedDate = element.dispatchedDate;
                let d_date;
                let d_month;
                let d_year;
                if (dispatchedDate != null) {

                    d_date = dispatchedDate.substr(0, 2);
                    d_month = dispatchedDate.substr(3, 2);
                    if (d_month <= 9) {
                        d_month = d_month.substr(1, 1);
                        d_month = parseInt(d_month) - 1;
                    }
                    d_year = dispatchedDate.substr(6, 10);

                    let dateArray = {
                        startDate: new Date(d_year, d_month, d_date),
                        autoclose: true,
                        todayHighlight: true,
                        format: 'd-mm-yyyy'
                    };
                    this.datepickerOptsArray.push(dateArray);
                }
            });
        });
    }


    userAction_new(row, data, action) {

        let r = confirm('Are you sure?');
        if (r == true) {

            let comments = $('#comment_' + data.inc_id).val();
            let vendor = $('#vendor_' + data.inc_id).val();
            let courier = $('#courier_' + data.inc_id).val();

            if (action == 'APPROVED') {

                if (vendor == '') {
                    this.toastr.pop('warning', 'Warning', 'kindly Select vendor.');
                    return true;
                }
                if (courier == '') {
                    this.toastr.pop('warning', 'Warning', 'kindly Select courier.');
                    return true;
                }


            } else {
                if (comments == undefined || comments == '') {
                    this.toastr.pop('warning', 'Warning', 'kindly enter comments.');
                    return true;
                }
            }

            let sendPostData = {
                action: action,
                userID: this.currentUser.userId,
                comment: comments,
                orderIndntId: data.orderIndentId,
                alf_ticket: this.currentUser.ticket,
                vendorID: vendor,
                courierId: courier
            };

            this._orderInventService.performVendorProcessingRecords(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                if (this.responceData.status == '200') {
                    row.remove();
                    this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                } else {
                    this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                }
            });
        }
    }

    onOrderReset() {
        this.viewInventoryPopup.hide();
        this.resetForm();
    }

    resetForm() {

        this.approvedInvData = {
            orderIndentId: null,
            inventory: {
                inventoryId: null,
                vendorId: null,
                itemName: null,
                thresholdLimit: null,
                ratePerUnit: null,
                gst: null,
                isActive: null,
                createdBy: null,
                createdOn: null,
                approvedBy: null,
                approvedOn: null,
                lastUpdatedBy: null,
                lastUpdatedOn: null
            },
            quantityRequired: null,
            dlmsBranchMaster: {
                dlmsBranchId: null,
                branchCode: null,
                branchName: null,
                branchAddress: null,
                city: null,
                state: null,
                country: null,
                contactDetails: null,
                courierServicable: null,
                isActive: null,
                createdBy: null,
                createdOn: null,
                lastUpdatedBy: null,
                lastUpdatedOn: null
            },
            createdBy: null,
            createdOn: null,
            approvalStatus: null,
            approvedBy: null,
            approvedOn: null,
            comment: null,
            orderNo: null,
            roleId: null,
            indentOrderStatus: null
        };

        this.iInventoryData = [];
        this.updateInvData = [];

    }




}
