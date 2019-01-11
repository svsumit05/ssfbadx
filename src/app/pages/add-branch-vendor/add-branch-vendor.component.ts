import { AfterViewInit, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { BranchService } from '../../services/branch.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { VendorsService } from '../../services/vendors.service';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-add-branch-vendor',
    templateUrl: './add-branch-vendor.component.html',
    styleUrls: ['./add-branch-vendor.component.css']
})
export class AddBranchVendorComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any;

    branchData = {
        dlmsBranchId: '',
        branchCode: '',
        branchName: '',
        branchAddress: null,
        city: null,
        state: null,
        country: null,
        contactDetails: null,
        courierServicable: null,
        isActive: 1,
        createdBy: null,
        createdOn: null,
        lastUpdatedBy: null,
        lastUpdatedOn: null
    };

    editbranchData = {
        dlmsBranchModId: '',
        dlmsBranchId: '',
        branchCode: '',
        branchName: '',
        branchAddress: null,
        city: null,
        state: null,
        country: null,
        contactDetails: null,
        courierServicable: '',
        isActive: 1,
        createdBy: '',
        createdOn: '',
        approvedBy: null,
        approvedOn: null,
        action: '',
        status: '',
        comment: null
    };

    private currentUser: User = new User();

    lisingUrl = '';
    navID: string;
    private sub: any;
    columnDefs: any = [];

    @ViewChild('addBranch') addBranch: Popup;
    @ViewChild('addBranchAppRejPopup') addBranchAppRejPopup: Popup;

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private zone: NgZone, private _vendorservice: VendorsService) {

        this.sub = this.route.params.subscribe(params => {
            this.navID = params['id'];
        });

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }


    ngOnInit(): void {

        let dataString = {};

        if (this.navID == 'pending') {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchPendingBranchMasterRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                loggedInUserName: this.currentUser.userId
            };

        } else {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedBranchMasterRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                branchmasterId: null
            };

        }

        this.columnDefs = [{
            'targets': [4],
            'visible': false,
            'searchable': false
        }];

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
                title: 'Id',
                data: 'dlmsBranchId',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Branch Name',
                data: 'branchName'
            }, {
                title: 'Branch Code',
                data: 'branchCode'
            }, {
                title: 'Courier Servicable',
                data: 'contactDetails'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    if (row.isActive == '1') {
                        return '<button type="submit" class="btn btn-default">Deactivate</button>';
                    } else {
                        return '<button type="submit" class="btn btn-default">Activate</button>';
                    }
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {
                    self.addBranchPopup(data);
                });

                $('td:nth-child(4)', row).unbind('click');
                $('td:nth-child(4)', row).bind('click', () => {
                    this.updateBranch(data, 0);
                });
                return row;
            }
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    addBranchPopup(info: any) {

        this.branchData = info;
        this.editbranchData = info;

        if (this.navID == 'pending') {

            this.addBranchAppRejPopup.options = {
                color: '#363794',
                header: 'Update branch',
                showButtons: false,
                widthProsentage: 100,
                animation: 'bounceInDown',
            };

            this.addBranchAppRejPopup.show(this.addBranchAppRejPopup.options);
        } else {

            this.addBranch.options = {
                color: '#363794',
                header: 'Update branch',
                showButtons: false,
                widthProsentage: 100,
                animation: 'bounceInDown',
            };

            this.addBranch.show(this.addBranch.options);

        }
    }

    updateBranch(info: any = {}, isActive = 1) {

        let lastUpdatedBy = this.currentUser.userId;

        if (isActive == 0) {
            this.branchData = info;
            this.editbranchData = info;
            this.branchData.isActive = (info.isActive == 1) ? 0 : 1;
        }

        this.branchServ.updateBranchCS(this.branchData, lastUpdatedBy).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Branch Updated Successfully.');
            this.addBranch.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.resetVarData();
            this.rerender();
        });
    }

    userAction(branchMasterModId, action, value) {

        let sendPostData = {
            action: action,
            userID: this.currentUser.userId,
            comment: value.comment,
            branchMasterModId: branchMasterModId,
            alf_ticket: this.currentUser.ticket
        };

        this.branchServ.performBranchApprovalAction(sendPostData).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Branch Updated Successfully.');
            this.addBranchAppRejPopup.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.resetVarData();
            this.rerender();
        });
    }



    cancelCreateBranch() {
        this.addBranch.hide();
        this.addBranchAppRejPopup.hide();
    }

    resetVarData() {
        this.branchData = {
            dlmsBranchId: '',
            branchCode: '',
            branchName: '',
            branchAddress: null,
            city: null,
            state: null,
            country: null,
            contactDetails: null,
            courierServicable: null,
            isActive: 1,
            createdBy: null,
            createdOn: null,
            lastUpdatedBy: null,
            lastUpdatedOn: null
        };

        this.editbranchData = {
            dlmsBranchModId: '',
            dlmsBranchId: '',
            branchCode: '',
            branchName: '',
            branchAddress: null,
            city: null,
            state: null,
            country: null,
            contactDetails: null,
            courierServicable: '',
            isActive: 1,
            createdBy: '',
            createdOn: '',
            approvedBy: null,
            approvedOn: null,
            action: '',
            status: '',
            comment: null
        };
    }

}
