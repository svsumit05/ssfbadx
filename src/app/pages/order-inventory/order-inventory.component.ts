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
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-order-inventory',
    templateUrl: './order-inventory.component.html',
    styleUrls: ['./order-inventory.component.css']
})
export class OrderInventoryComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    private currentUser: User = new User();

    inventoryListDropDown: any;
    instaKitListDropDown: any;
    branchDropDown: any;
    selectedInventoryData: any;
    errorMsg: any;
    responceData: any;
    enableInstaKit = false;
    approvedList = [];
    rejectedList = [];


    checkIsInstaKit = 0;

    addorderDetails = {
        inventory: {
            inventoryId: ''
        },
        quantityRequired: '',
        dlmsBranchMaster: {
            branchCode: ''
        },
        createdBy: '',
        roleId: 0,
        productType: 0,
        isDebitCardReqFlag: 0,
        isCheqBookReqFlag: 0
    };

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
            lastUpdatedOn: null,
            totalOrderdCount: null,
            approvalIsPending: null,
            isInstaKit: null,
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

    isvalid = false;
    iInventoryData = [];
    orderData = [];

    updateInvData = [];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOptsArray = [];

    showDatePicker = false;

    fromDate = new Date();
    toDate = new Date();
    branch = '';

    private currentUser: User = new User();
    private _listingURL;
    private columns: any;
    private columnDefs: any;
    navID: string;
    private sub: any;

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {

        this.sub = this.route.params.subscribe(params => {
            this.navID = params['id'];
        });

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
            this._orderInventService.fetchAllInstaKitProductType().subscribe(resdata => this.instaKitListDropDown = resdata, () => { }, () => { });
        });

    }

    @ViewChild('orderInventoryPopup') orderInventoryPopup: Popup;
    @ViewChild('approveInventoryPopup') approveInventoryPopup: Popup;
    @ViewChild('viewInventoryPopup') viewInventoryPopup: Popup;

    ngOnInit(): void {
        let dataString = {};
        this.branch = this.currentUser.user_extra_info.branch;

        if (this.navID == 'pending') {

            this._listingURL = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchPendingIndentRecordsForApproval?alf_ticket=' + this.currentUser.ticket;

            dataString = {
                loggedInsUserName: this.currentUser.userId,
                roleId: this.currentUser.user_extra_info.role.roleID,
                branchCode: this.currentUser.user_extra_info.branch
            };

            this.columns = [
                {
                    title: 'Order No',
                    data: 'orderNo',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                    }
                },
                {
                    title: 'Item Name',
                    data: 'inventory.itemName'
                },
                {
                    title: 'Quantity',
                    data: 'quantityRequired'
                },
                {
                    title: 'Dispatch Quantity',
                    data: 'totalDispatchQuantity'
                },
                {
                    title: 'Balance Quantity',
                    data: 'balancedQuantity'
                },
                {
                    title: 'Rate',
                    data: 'inventory.ratePerUnit'
                },
                {
                    title: 'Status',
                    data: 'indentOrderStatus'
                },
                {
                    title: 'Comment',
                    data: '',
                    render: function (data, type, row) {
                        return '<textarea id="comment_' + row.orderNo + '" class="form-control" rows="3"></textarea>';
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
                { width: 200, targets: 0 },
                { width: 200, targets: 1 },
                { width: 100, targets: 2 },
                { width: 100, targets: 3 },
                { width: 100, targets: 4 },
                { width: 100, targets: 5 },
                { width: 200, targets: 6 },
                { width: 300, targets: 7 },
                { width: 50, targets: 8 },
                { width: 50, targets: 9 }
            ];

        } else {
            this._listingURL = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchAllApprovedInventory?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                fromDate: this._utilService.formateDateYYMMDD(this.fromDate),
                toDate: this._utilService.formateDateYYMMDD(this.toDate),
                branch: this.currentUser.user_extra_info.branch
            };

            this.columns = [
                {
                    title: 'Order No',
                    data: 'orderNo',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                    }
                },
                {
                    title: 'Item Name',
                    data: 'inventory.itemName'
                },
                {
                    title: 'Quantity',
                    data: 'quantityRequired'
                },
                {
                    title: 'Dispatch Quantity',
                    data: 'totalDispatchQuantity'
                },
                {
                    title: 'Balance Quantity',
                    data: 'balancedQuantity'
                },
                {
                    title: 'Rate',
                    data: 'inventory.ratePerUnit'
                },
                {
                    title: 'Status',
                    data: 'indentOrderStatus'
                }
            ];

            this.columnDefs = [];
        }


        this.dtOptions = {
            ajax: {
                url: this._listingURL,
                method: 'POST',
                data: dataString,
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: this.columns,
            searching: true,
            columnDefs: this.columnDefs,
            buttons: [
                'selectAll',
                'selectNone',
                {
                    text: 'Approve Selected',
                    action: (e, dt, node, config) => {
                        let countData = dt.rows({ selected: true }).count();
                        let data_array = dt.rows({ selected: true }).data();
                        for (let i = 0; i < countData; i++) {
                            this.approvedList.push(data_array[i].orderIndentId);
                        }
                        this.performOrderIndentMultipleApprovalAction('APPROVED', this.approvedList);
                        console.log(this.approvedList);
                    }
                },
                {
                    text: 'Reject Selected',
                    action: (e, dt, node, config) => {
                        let countData = dt.rows({ selected: true }).count();
                        let data_array = dt.rows({ selected: true }).data();
                        for (let i = 0; i < countData; i++) {
                            this.rejectedList.push(data_array[i].orderIndentId);
                        }
                        this.performOrderIndentMultipleApprovalAction('REJECTED', this.rejectedList);
                        console.log(this.rejectedList);

                    }
                }
            ],
            select: true,
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
            dom: 'Bfrtip',
            oLanguage: {
                sSearch: 'Global search',
                buttons: {
                    selectAll: 'Select all items',
                    selectNone: 'Select none'
                }
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

            if (this.navID != 'pending') {

                let dataString = {
                    fromDate: this._utilService.formateDateYYMMDD(this.fromDate),
                    toDate: this._utilService.formateDateYYMMDD(this.toDate),
                    branch: this.branch
                };

                this.dtOptions.ajax = {
                    url: this._listingURL,
                    method: 'POST',
                    data: dataString,
                    dataSrc: function (json) {
                        let return_array = [];
                        return_array = json;
                        return return_array;
                    }
                };

            }

            this.dtTrigger.next();
        });
    }


    someClickHandler(info: any): void {

        this.approvedInvData = info;

        if (this.navID == 'pending') {

            this.approveInventoryPopup.options = {
                color: '#363794',
                header: 'View Order',
                showButtons: false,
                widthProsentage: 99,
                animation: 'bounceInDown',
            };
            this.approveInventoryPopup.show(this.approveInventoryPopup.options);

        } else {

            this.viewInventoryPopup.options = {
                color: '#363794',
                header: 'View Order',
                showButtons: false,
                widthProsentage: 99,
                animation: 'bounceInDown',
            };

            if (info.inventory.isInstaKit == '0' || info.inventory.isInstaKit == '2') {

                this._orderInventService.fetchOrderIndentTransByOrderInv(info.orderIndentId).subscribe(resdata => this.iInventoryData = resdata, reserror => this.errorMsg = reserror, () => {
                    this.viewInventoryPopup.show(this.viewInventoryPopup.options);
                    this.updateInvData = this.iInventoryData;

                    setTimeout(() => {
                        this.showDatePicker = true;
                    }, 1000);

                    this.iInventoryData.forEach(element => {
                        if (element.userAction != null) {
                            element.isActionDone = 1;
                        } else {
                            element.isActionDone = 0;
                        }

                        if (element.receiptDate == undefined) {
                            let t_date = new Date();
                            element.receiptDate = this._utilService.formateDateYYMMDD(t_date);
                        }


                        // element.dispatchedDate
                        let dispatchedDate = element.dispatchedDate;
                        let d_date;
                        let d_month;
                        let d_year;
                        if (dispatchedDate != null && dispatchedDate != undefined) {

                            d_date = dispatchedDate.substr(0, 2);
                            d_month = dispatchedDate.substr(3, 2);
                            if (d_month <= 9) {
                                d_month = d_month.substr(1, 1);
                                d_month = parseInt(d_month) - 1;
                            }
                            d_year = dispatchedDate.substr(6, 10);

                            let dateArray = {
                                startDate: d_year + '-' + d_month + '-' + d_date
                            };
                            this.datepickerOptsArray.push(dateArray);
                        } else {

                            let dateArray = {
                                startDate: '2018-01-01'
                            };
                            this.datepickerOptsArray.push(dateArray);
                        }
                    });
                });

            } else {

                this.checkIsInstaKit = 1;

                this._orderInventService.fetchInstaKitBeanList(info.orderIndentId).subscribe(resdata => this.iInventoryData = resdata, reserror => this.errorMsg = reserror, () => {
                    this.viewInventoryPopup.show(this.viewInventoryPopup.options);
                    this.updateInvData = this.iInventoryData;

                    this.iInventoryData.forEach(element => {
                        if (element.userAction != null) {
                            element.isActionDone = 1;
                        } else {
                            element.isActionDone = 0;
                        }

                        if (element.receiptDate == undefined) {
                            let t_date = new Date();
                            element.receiptDate = this._utilService.formateDateYYMMDD(t_date);
                        }

                        // element.dispatchedDate
                        let dispatchedDate = element.dispatchedDate;
                        let d_date;
                        let d_month;
                        let d_year;
                        if (dispatchedDate != null && dispatchedDate != undefined) {

                            d_date = dispatchedDate.substr(0, 2);
                            d_month = dispatchedDate.substr(3, 2);
                            if (d_month <= 9) {
                                d_month = d_month.substr(1, 1);
                                d_month = parseInt(d_month) - 1;
                            }
                            d_year = dispatchedDate.substr(6, 10);

                            let dateArray = {
                                startDate: d_year + '-' + d_month + '-' + d_date
                            };
                            this.datepickerOptsArray.push(dateArray);
                        } else {

                            let dateArray = {
                                startDate: '2018-01-01'
                            };
                            this.datepickerOptsArray.push(dateArray);
                        }
                    });

                    setTimeout(() => {
                        this.showDatePicker = true;
                    }, 1000);
                });
            }
        }
    }



    orderInventory() {

        this.orderInventoryPopup.options = {
            color: '#363794',
            header: 'Add Order',
            showButtons: false,
            widthProsentage: 99,
            animation: 'bounceInDown',
        };

        this.branch = this.currentUser.user_extra_info.branch;
        this.addorderDetails.dlmsBranchMaster.branchCode = this.currentUser.user_extra_info.branch;

        this._orderInventService.getInventoryList(this.currentUser.user_extra_info.product).subscribe(resdata => this.inventoryListDropDown = resdata, () => { }, () => {
            this.orderInventoryPopup.show(this.orderInventoryPopup.options);
        }
        );


    }

    onInput() {

        let inventoryId = this.addorderDetails.inventory.inventoryId;
        this.inventoryListDropDown.forEach(element => {
            if (element.inventoryId == inventoryId) {
                this.selectedInventoryData = element;
            }
        });

        if (this.selectedInventoryData.isInstaKit == '0' || this.selectedInventoryData.isInstaKit == null) {

            let orderInv = {
                inventory: {
                    inventoryId: this.selectedInventoryData.inventoryId
                },
                quantityRequired: 1,
                dlmsBranchMaster: {
                    branchCode: this.currentUser.user_extra_info.branch
                },
                createdBy: this.currentUser.userId,
                roleId: this.currentUser.user_extra_info.role.roleID,
                inventoryName: this.selectedInventoryData.itemName,
                inventoryRate: this.selectedInventoryData.ratePerUnit,
                totalOrderdCount: this.selectedInventoryData.totalOrderdCount,
                thresholdLimit: this.selectedInventoryData.thresholdLimit,
                productType: 0,
                isDebitCardReqFlag: 0,
                isCheqBookReqFlag: 0
            };

            this.orderData.push(orderInv);

            this.enableInstaKit = false;

        } else {
            this.enableInstaKit = true;
        }

        if (this.enableInstaKit == true && this.selectedInventoryData.isInstaKit == '0') {
            let r = confirm('Seleting Product other than instakit will reset all Order data.');
            if (r == true) {
                this.orderData = [];
            }
        }

        if (this.enableInstaKit == false && this.selectedInventoryData.isInstaKit == '1') {
            let r = confirm('Seleting Product instakit will reset all Order data.');
            if (r == true) {
                this.orderData = [];
            }
        }
    }

    onInputInstaKit() {

        let orderInv = {
            inventory: {
                inventoryId: this.selectedInventoryData.inventoryId
            },
            quantityRequired: 1,
            dlmsBranchMaster: {
                branchCode: this.currentUser.user_extra_info.branch
            },
            createdBy: this.currentUser.userId,
            roleId: this.currentUser.user_extra_info.role.roleID,
            inventoryName: this.selectedInventoryData.itemName,
            inventoryRate: this.selectedInventoryData.ratePerUnit,
            totalOrderdCount: this.selectedInventoryData.totalOrderdCount,
            thresholdLimit: this.selectedInventoryData.thresholdLimit,
            productType: this.addorderDetails.productType,
            isDebitCardReqFlag: 0,
            isCheqBookReqFlag: 0,
        };

        this.orderData.push(orderInv);
    }

    checkdebitcard(indexI) {
        let debit = document.getElementById('DebitCard_' + indexI).checked;

        if (debit == true) {
            this.orderData[indexI].isDebitCardReqFlag = 1;
        } else {
            this.orderData[indexI].isDebitCardReqFlag = 0;
        }
    }

    checkcreditcard(indexI) {
        let credit = document.getElementById('ChequeBook_' + indexI).checked;

        if (credit == true) {
            this.orderData[indexI].isCheqBookReqFlag = 1;
        } else {
            this.orderData[indexI].isCheqBookReqFlag = 0;
        }
    }

    checkThresholdLimit(indexI) {

        let quantityRequired = document.getElementById('quantity_' + indexI).value;

        if (quantityRequired < '1') {
            this.toastr.pop('warning', 'Warning', 'Quantity should be grater than 0.');
            return true;
        }

        let thresholdLimit = parseInt(this.orderData[indexI].totalOrderdCount, 10) + parseInt(quantityRequired, 10);

        let allow_limit = parseInt(this.orderData[indexI].thresholdLimit, 10) - parseInt(this.orderData[indexI].totalOrderdCount, 10);

        if (this.orderData[indexI].totalOrderdCount != null && (thresholdLimit > this.orderData[indexI].thresholdLimit)) {
            alert('Quantity should be less than or equal to ' + allow_limit);
            document.getElementById('quantity_' + indexI).value = 0;
            this.isvalid = false;
        } else {
            this.orderData[indexI].quantityRequired = quantityRequired;
            this.isvalid = true;
        }
    }

    removeElement(inventoryId) {

        this.orderData = this.orderData.filter(item => {
            return (item.inventory.inventoryId != inventoryId);
        });

    }

    removeElementType(productType) {

        this.orderData = this.orderData.filter(item => {
            return (item.productType != productType);
        });

    }


    onOrderPlace() {

        console.log(this.orderData);


        this._orderInventService.addInventoryorder(this.orderData, this.enableInstaKit).subscribe(res => this.responceData = res, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status == '200') {
                this.orderInventoryPopup.hide();
                this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                this.rerender();
            } else {
                this.orderInventoryPopup.hide();
                this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
                this.rerender();
            }
            this.resetForm();
        });

    }

    userAction_new(row, data, action) {
        let r = confirm('Are you sure?');
        if (r == true) {

            let comments = document.getElementById('comment_' + data.orderNo).value;

            let sendPostData = {
                action: action,
                userID: this.currentUser.userId,
                comment: comments,
                orderIndentId: data.orderIndentId,
                alf_ticket: this.currentUser.ticket
            };

            this._orderInventService.performOrderIndentApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                row.remove();
                this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                this.rerender();
            });
        }

    }

    onOrderReset() {
        this.orderInventoryPopup.hide();
        this.approveInventoryPopup.hide();
        this.viewInventoryPopup.hide();
        this.checkIsInstaKit = 0;
        this.resetForm();
    }

    userAction(orderIndentId: any, action: any, value: any) {

        let sendPostData = {
            action: action,
            userID: this.currentUser.userId,
            comment: value.comment,
            orderIndentId: orderIndentId,
            alf_ticket: this.currentUser.ticket
        };

        this._orderInventService.performOrderIndentApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == '200') {
                this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                this.approveInventoryPopup.hide();
                this.rerender();
            } else {
                this.approveInventoryPopup.hide();
                this.toastr.pop('error', 'Error', this.responceData.statusMessge);
            }

        });

    }

    updateIndentAcceptanceStatus(idx, orderIndentTransId, orderIndentId, lastDispatchedQuantity) {
        let r = confirm('Are you sure?');
        if (r == true) {

            let sendData = {
                orderIndentTransId: orderIndentTransId,
                status: this.iInventoryData[idx].userAction,
                receiptDate: this._utilService.formateDateCommon(this.iInventoryData[idx].receiptDate),
                loggedInUser: this.currentUser.userId,
                currentDispatchedQuantity: lastDispatchedQuantity,
                orderInventId: orderIndentId,
                remark: this.iInventoryData[idx].remark
            };

            if (this.checkIsInstaKit == '0') {

                this._orderInventService.updateIndentAcceptanceStatus(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                    if (this.responceData.status == '200') {
                        this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                        this.iInventoryData[idx].isActionDone = 1;
                        this.iInventoryData[idx].receiptDate = sendData.receiptDate;
                        this.rerender();
                    } else {
                        this.approveInventoryPopup.hide();
                        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                    }

                });

            } else {

                this._orderInventService.updateInstakitAcceptanceStatus(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                    if (this.responceData.status == '200') {
                        this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                        this.iInventoryData[idx].isActionDone = 1;
                        this.iInventoryData[idx].receiptDate = sendData.receiptDate;
                        this.rerender();
                    } else {
                        this.approveInventoryPopup.hide();
                        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                    }

                });

            }



        } else {
            this.iInventoryData[idx].receiptDate = null;
            this.iInventoryData[idx].userAction = null;
        }

    }


    sendtoFRFC(idx, orderIndentTransId, orderIndentId, lastDispatchedQuantity) {
        let r = confirm('Are you sure?');
        if (r == true) {

            let sendData = {
                instaKitId: orderIndentTransId
            };

            this._orderInventService.sendRecordBackToFRFC(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                if (this.responceData.status == '200') {
                    this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                } else {
                    // this.approveInventoryPopup.hide();
                    this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                }

            });

        }

    }

    resetForm() {

        this.enableInstaKit = false;

        this.orderData = [];

        this.addorderDetails = {
            inventory: {
                inventoryId: ''
            },
            quantityRequired: '',
            dlmsBranchMaster: {
                branchCode: ''
            },
            createdBy: '',
            roleId: 0,
            productType: 0,
            isDebitCardReqFlag: 0,
            isCheqBookReqFlag: 0
        };

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
                lastUpdatedOn: null,
                totalOrderdCount: null,
                approvalIsPending: null,
                isInstaKit: null,
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
        this.showDatePicker = false;

    }


    performOrderIndentMultipleApprovalAction(action, orderIndentId) {

        if (orderIndentId.length == 0) {
            this.toastr.pop('warning', 'warning', 'Kindly select data.');
            return false;
        }

        let r = confirm('Are you sure ?');
        if (r == true) {
            let sendData = {
                action: action,
                userID: this.currentUser.userId,
                comment: action,
                orderIndentId: orderIndentId,
                alf_ticket: this.currentUser.ticket
            };
            this._orderInventService.performOrderIndentMultipleApprovalAction(sendData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                if (this.responceData.status == '200') {
                    this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                    this.rerender();
                    this.approvedList = [];
                    this.rejectedList = [];
                } else {
                    this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                }
            });

        } else {
            this.toastr.pop('warning', 'canceled', 'Operation canceled Succesfully.');
        }
    }



}
