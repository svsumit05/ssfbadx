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
    selector: 'app-documenttype',
    templateUrl: './documenttype.component.html',
    styleUrls: ['./documenttype.component.css']
})
export class DocumenttypeComponent implements OnInit, AfterViewInit {

    addDocumentTypeData = {
        'documentId': '',
        'documentType': '',
        'documentIdentifier': '',
        'isActive': '1'
    };

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    private currentUser: User = new User();
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

    @ViewChild('documentTypeDetailViewPopup') documentTypeDetailViewPopup: Popup;
    @ViewChild('documentTypeAddPopup') documentTypeAddPopup: Popup;
    @ViewChild('documentTypeAppRejPopup') documentTypeAppRejPopup: Popup;

    someClickHandler(info: any): void {

        this.addDocumentTypeData = info;


        if (this.navID == 'pending') {

            this.documentTypeAppRejPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'Vendor Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };
            this.documentTypeAppRejPopup.show(this.documentTypeAppRejPopup.options);


        } else {

            this.documentTypeDetailViewPopup.options = {
                cancleBtnClass: 'btn btn-default',
                confirmBtnClass: 'btn btn-mbe-attack',
                color: '#363794',
                header: 'Edit Vendor Details',
                widthProsentage: 99,
                showButtons: false,
                animation: 'bounceInDown',
                confirmBtnContent: 'Submit'
            };
            this.documentTypeDetailViewPopup.show(this.documentTypeDetailViewPopup.options);

        }
    }


    ngOnInit() {
        let dataString = {};

        if (this.navID == 'pending') {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/recordController/fetchAllDocumentTypes?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                loggedInUserName: this.currentUser.userId
            };

            this.columnDefs = [{
                'targets': [4],
                'visible': false,
                'searchable': false
            }];

        } else {
            this.lisingUrl = environment.api_base_url_new + 'BranchCreation/recordController/fetchAllDocumentTypes?alf_ticket=' + this.currentUser.ticket;
            dataString = {
                documentId: null
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
                title: 'Document Id',
                data: 'documentId',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Document Type',
                data: 'documentType',
            }, {
                title: 'Document Identifier',
                data: 'documentIdentifier'
            }/* , {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    if (row.isApprovelPending == 'true') {
                        return '<button type="submit" class="btn btn-warning">Approval Pending</button>';
                    } else if (row.isActive == '1') {
                        return '<button type="submit" class="btn btn-danger">Deactivate</button>';
                    } else if (row.isActive == '0') {
                        return '<button type="submit" class="btn btn-success">Activate</button>';
                    }
                }
            } */],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {
                    self.someClickHandler(data);
                });

                /* $('td:nth-child(4)', row).unbind('click');
                $('td:nth-child(4)', row).bind('click', () => {
                    this.editDocumentTypeDetails(data, 0);
                }); */
                return row;
            },

        };

    }

    addDocumentDetails() {

        let postData = {
            documentType: this.addDocumentTypeData.documentType,
            documentIdentifier: this.addDocumentTypeData.documentIdentifier,
            isActive: this.addDocumentTypeData.isActive
        };

        this._vendorservice.createDocument(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status == 200) {
                this.documentTypeAddPopup.hide();
                this.rerender();
            } else {
                this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
            }
        });



    }

    editDocumentTypeDetails(info: any = {}, isActive = 1) {

        /* if (info.isApprovelPending != 'true') {

            let r = confirm('Are you sure?');
            if (r == true) {

                if (isActive == 0) {
                    this.addVendorData = info;
                } */

                let postData = {
                    documentId: this.addDocumentTypeData.documentId,
                    documentType: this.addDocumentTypeData.documentType,
                    documentIdentifier: this.addDocumentTypeData.documentIdentifier,
                    isActive: this.addDocumentTypeData.isActive
                };

                this._vendorservice.updateDocument(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                    if (this.responceData.status == 200) {
                        this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                        this.documentTypeDetailViewPopup.hide();
                        this.rerender();
                    } else {
                        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
                    }
                });
            /* }
        } */
    }


    addDocumentType() {
        this.documentTypeAddPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Add Vendor Details',
            widthProsentage: 99,
            showButtons: false,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.documentTypeAddPopup.show(this.documentTypeAddPopup.options);
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
        this.documentTypeAddPopup.hide();
        this.documentTypeDetailViewPopup.hide();
        this.documentTypeAppRejPopup.hide();
        this.resetData();
    }

    userAction(vendorModifiedId: any, action: any, value: any) {

        let sendPostData = {
            action: action,
            userID: this.currentUser.userId,
            comment: value.comment,
            vendorModifiedId: vendorModifiedId,
            alf_ticket: this.currentUser.ticket
        };


        this._vendorservice.performVendorApprovalAction(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == '200') {
                this.toastr.pop('success', 'Success', this.responceData.statusMessge);
                this.documentTypeAppRejPopup.hide();
                this.rerender();
            } else {
                this.toastr.pop('error', 'Error', this.responceData.statusMessge);
            }

        });

    }

    resetData() {
        this.addDocumentTypeData = {
            'documentId': '',
            'documentType': '',
            'documentIdentifier': '',
            'isActive': '1'
        };
    }


}
