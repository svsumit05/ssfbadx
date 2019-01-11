import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-vendors',
    templateUrl: './couriors.component.html',
    styleUrls: ['./couriors.component.css']
})
export class CouriorsComponent implements OnInit, AfterViewInit {

    addCourierData = {
        courierId: '',
        courierName: '',
        courierAddress: '',
        city: '',
        state: '',
        country: '',
        contactDetails: '',
        emailId: '',
        isActive: 1,
        createdBy: '',
        createdOn: '',
        approvedBy: '',
        approvedOn: '',
        lastUpdatedBy: '',
        lastUpdatedOn: '',
        courierModifiedId: ''
    };

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    private currentUser: User = new User();
    statesList: any;
    cityList: any;
    inventList: any;
    responceData: any;
    errorMsg = '';
    lisingUrl = '';
    navID: string;
    private sub: any;
    columnDefs: any = [];

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _vendorservice: VendorsService, private toastr: ToasterService) {

        this.sub = this.route.params.subscribe(params => {
            this.navID = params['id'];
        });

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    }

    @ViewChild('vendorDetailViewPopup') vendorDetailViewPopup: Popup;
    @ViewChild('vendorAddPopup') vendorAddPopup: Popup;
    @ViewChild('vendorAppRejPopup') vendorAppRejPopup: Popup;

    someClickHandler(info: any): void {

        this.addCourierData = info;

        if (this.navID == 'pending') {

            this.vendorAppRejPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'Courier Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };
            this.vendorAppRejPopup.show(this.vendorAppRejPopup.options);


        } else {

            this.vendorDetailViewPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'Edit Courier Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };
            this.vendorDetailViewPopup.show(this.vendorDetailViewPopup.options);

        }
    }


    ngOnInit() {
        let dataString = {};

        if (this.navID == 'pending') {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchPendingCourierRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                loggedInUserName: this.currentUser.userId
            };

            this.columnDefs = [{
                'targets': [4],
                'visible': false,
                'searchable': false
            }];

        } else {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedCourierRecords?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                courierId: null
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
                title: 'Courier Name',
                data: 'courierName',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Email Id',
                data: 'emailId'
            }, {
                title: 'Phone No.',
                data: 'contactDetails'
            }, {
                title: 'City',
                data: 'city'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    if (row.isApprovalPending == 'true') {
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

                $('td:nth-child(5)', row).unbind('click');
                $('td:nth-child(5)', row).bind('click', () => {
                    this.editVendorDetails(data, 0);
                });
                return row;
            },

        };

    }

    addVendorDetails() {

        let postData = {
            courierName: this.addCourierData.courierName,
            courierAddress: this.addCourierData.courierAddress,
            city: this.addCourierData.city,
            state: this.addCourierData.state,
            country: this.addCourierData.country,
            contactDetails: this.addCourierData.contactDetails,
            emailId: this.addCourierData.emailId,
            isActive: 1,
            createdBy: this.currentUser.userId
        };

        this._vendorservice.createCourier(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status == 200) {
                this.vendorAddPopup.hide();
                this.rerender();
            } else {
                this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
            }
        });



    }

    editVendorDetails(info: any = {}, isActive = 1) {

        if (info.isApprovalPending != 'true') {

            let r = confirm('Are you sure?');
            if (r == true) {

                if (isActive == 0) {
                    this.addCourierData = info;
                }

                let postData = {
                    courierName: this.addCourierData.courierName,
                    courierAddress: this.addCourierData.courierAddress,
                    city: this.addCourierData.city,
                    state: this.addCourierData.state,
                    country: this.addCourierData.country,
                    contactDetails: this.addCourierData.contactDetails,
                    emailId: this.addCourierData.emailId,
                    isActive: (info.isActive == 1) ? 0 : 1,
                    updatedBy: this.currentUser.userId,
                    courierId: this.addCourierData.courierId
                };

                this._vendorservice.updateCourier(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                    if (this.responceData.status == 200) {
                        this.vendorDetailViewPopup.hide();
                        this.rerender();
                    } else {
                        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
                    }
                });
            }
        }
    }


    addVendor() {

        this.vendorAddPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Add Courier Details',
            widthProsentage: 99,
            showButtons: false,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.vendorAddPopup.show(this.vendorAddPopup.options);

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

    closeFrom() {
        this.vendorAddPopup.hide();
        this.vendorDetailViewPopup.hide();
        this.vendorAppRejPopup.hide();
        this.resetData();
    }

    userAction(courierModifiedId: any, action: any, value: any) {

        let sendPostData = {
            action: action,
            userID: this.currentUser.userId,
            comment: value.comment,
            courierModifiedId: courierModifiedId,
            alf_ticket: this.currentUser.ticket
        };


        this._vendorservice.performCourierApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == '200') {
                this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                this.vendorAppRejPopup.hide();
                this.rerender();
            } else {
                this.toastr.pop('error', 'Error', this.responceData.statusMessge);
            }

        });

    }

    resetData() {
        this.addCourierData = {
            courierId: '',
            courierName: '',
            courierAddress: '',
            city: '',
            state: '',
            country: '',
            contactDetails: '',
            emailId: '',
            isActive: 1,
            createdBy: '',
            createdOn: '',
            approvedBy: '',
            approvedOn: '',
            lastUpdatedBy: '',
            lastUpdatedOn: '',
            courierModifiedId: ''
        };
    }


}
