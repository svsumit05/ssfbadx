import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { VendorsService } from '../../services/vendors.service';
import { BranchService } from '../../services/branch.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { InventoryMasterService } from '../../services/inventory-master.service';

@Component({
    selector: 'app-inventory-master',
    templateUrl: './inventory-master.component.html',
    styleUrls: ['./inventory-master.component.css']
})
export class InventoryMasterComponent implements OnInit, AfterViewInit {

    addInventoryData = {
        inventoryId: null,
        itemName: '',
        thresholdLimit: '',
        ratePerUnit: '',
        gst: '',
        isActive: 1,
        createdBy: null,
        createdOn: null,
        approvedBy: null,
        approvedOn: null,
        lastUpdatedBy: null,
        lastUpdatedOn: null,
        inventoryModId: null,
        isInstakit: 0,
        productName: ''
    };

    errorMsg = '';
    responceData: any;
    vendorsList: any;
    WorkLineProductList: any;

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();
    private currentUser: User = new User();
    lisingUrl = '';
    navID: string;
    private sub: any;
    columnDefs: any = [];

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _invetservice: InventoryMasterService, private toastr: ToasterService, private _vendorservice: VendorsService, private branchServ: BranchService) {
        this.sub = this.route.params.subscribe(params => {
            this.navID = params['id'];
        });

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('inventroyDetailViewPopup') inventroyDetailViewPopup: Popup;
    @ViewChild('inventroyAddPopup') inventroyAddPopup: Popup;
    @ViewChild('inventroyApprovalViewPopup') inventroyApprovalViewPopup: Popup;
    someClickHandler(info: any): void {
        this.addInventoryData = info;
        this.getDetailRowInfo();
    }

    ngOnInit() {

        let dataString = {};

        if (this.navID == 'pending') {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchPendingInventoryRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                loggedInUserName: this.currentUser.userId
            };

            this.columnDefs = [{
                'targets': [3],
                'visible': false,
                'searchable': false
            }];

        } else {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedInventoryRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                inventoryId: null
            };
        }

        this.dtOptions = {
            ajax: {
                url: this.lisingUrl,
                method: 'POST',
                data: dataString,
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'Name',
                data: 'itemName',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Threshold Limit',
                data: 'thresholdLimit'
            }, {
                title: 'Price',
                data: 'ratePerUnit',
                render: function (data, type, row) {
                    let ratePerUnit = parseFloat(row.ratePerUnit);
                    return ratePerUnit.toFixed(2);
                }
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    if (row.approvalIsPending == 'true') {
                        return '<button type="submit" class="btn btn-warning">Approval Pending</button>';
                    } else if (row.isActive == '1') {
                        return '<button type="submit" class="btn btn-danger">Deactivate</button>';
                    } else if (row.isActive == '0') {
                        return '<button type="submit" class="btn btn-success">Activate</button>';
                    }
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {
                    self.someClickHandler(data);
                });

                $('td:nth-child(4)', row).unbind('click');
                $('td:nth-child(4)', row).bind('click', () => {
                    this.editInventroyDetails(data, 0);
                });
                return row;
            },

        };

    }


    addInventroyDetails() {
        this.addInventoryData.createdBy = this.currentUser.userId;

        debugger;

        this._invetservice.addInventrory(this.addInventoryData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            this.inventroyAddPopup.hide();
            this.rerender();
            this.resetData();
        });
    }

    editInventroyDetails(info: any = {}, isActive = 1) {

        if (info.approvalIsPending != 'true') {

            let r = confirm('Are you sure?');
            if (r == true) {

                if (isActive == 0) {
                    this.addInventoryData = info;
                    this.addInventoryData.isActive = (info.isActive == 1) ? 0 : 1;
                }

                this.addInventoryData.lastUpdatedBy = this.currentUser.userId;

                this._invetservice.updateInventrory(this.addInventoryData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                    this.inventroyDetailViewPopup.hide();
                    this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                    this.rerender();
                    this.resetData();
                });
            }
        }
    }

    getDetailRowInfo() {

        console.log(this.addInventoryData);

        this.WorkLineProductList = '';

        this._vendorservice.fetchAllWorkLineProduct().subscribe(resdata => this.WorkLineProductList = resdata, reserror => this.errorMsg = reserror, () => { });

        if (this.navID == 'pending') {

            this.inventroyApprovalViewPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'View Inventory Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };

            this.inventroyApprovalViewPopup.show(this.inventroyApprovalViewPopup.options);

        } else {
            this.inventroyDetailViewPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'Update Inventory Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };

            this.inventroyDetailViewPopup.show(this.inventroyDetailViewPopup.options);

        }
    }

    addInventory() {

        this.inventroyAddPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Add Inventory Details',
            widthProsentage: 99,
            showButtons: false,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };

        this._vendorservice.fetchAllWorkLineProduct().subscribe(resdata => this.WorkLineProductList = resdata, reserror => this.errorMsg = reserror, () => {
            this.inventroyAddPopup.show(this.inventroyAddPopup.options);
        });

    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
        $.fn.dataTable.ext.errMode = 'none';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    resetData() {
        this.addInventoryData = {
            inventoryId: null,
            itemName: '',
            thresholdLimit: '',
            ratePerUnit: '',
            gst: '',
            isActive: 1,
            createdBy: null,
            createdOn: null,
            approvedBy: null,
            approvedOn: null,
            lastUpdatedBy: null,
            lastUpdatedOn: null,
            inventoryModId: null,
            isInstakit: 0,
            productName: ''
        };
    }

    closeForm() {
        this.inventroyDetailViewPopup.hide();
        this.inventroyAddPopup.hide();
        this.inventroyApprovalViewPopup.hide();
        this.rerender();
        this.resetData();
    }

    userAction(inventoryModId: any, action: any, value: any) {

        let sendPostData = {
            action: action,
            userID: this.currentUser.userId,
            comment: value.comment,
            inventoryModId: inventoryModId,
            alf_ticket: this.currentUser.ticket
        };

        this._invetservice.performVendorApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == '200') {
                this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                this.inventroyApprovalViewPopup.hide();
                this.rerender();
                this.resetData();
            } else {
                this.toastr.pop('error', 'Error', this.responceData.statusMessge);
            }

        });

    }
}
