import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { BranchService } from '../../services/branch.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-prereq-validate',
    templateUrl: './prereq-validate.component.html',
    styleUrls: ['./prereq-validate.component.css']
})
export class PrereqValidateComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any;
    private currentUser: User = new User();
    branchDetails = {
        branchId: '',
        createdBy: ''
    };

    displayMode: any = '';

    editPrereqMastersData: any = {};
    addPrereqMastersData: any = [];
    validatePrerequisiteDetailsMasterId = 0;

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.branchServ.fetchValidatePrerequisteItemList().subscribe(resdata => this.addPrereqMastersData = resdata, reserror => this.errorMsg = reserror, () => {

        });

    }

    @ViewChild('validatePrereq') validatePrereq: Popup;


    ngOnInit(): void {
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url_new + 'BranchCreation/getAllBranch' + '?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {},
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'RBI Ref. No.',
                data: 'rbiReferenceNo'
            }, {
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
                    let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-check-circle\' aria-hidden=\'true\'></i> Validate Pre-requisites </a>';
                    return row_title;
                }
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)


                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.addPreReqData(data);
                });

                return row;

            }

        };
    }

    addPreReqData(info: any) {

        this.branchDetails.branchId = info.branchId;
        this.branchDetails.createdBy = this.currentUser.userId;

        this.validatePrereq.options = {
            color: '#363794',
            header: 'Validate pre-requisites / statutory are fulfilled by Admin Infra team.',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };


        this.branchServ.checkBranchAssetsStatusUpdated(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == 'Asset status updation pending') {
                this.toastr.pop('warning', 'Pending', 'Branch Assests Status Pending.');
            } else {

                this.branchServ.fetchValidatePrerequisite(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                    if (this.responceData.validatePrerequisiteDetailsList.length > 0) {

                        this.displayMode = 'EDIT';
                        this.editPrereqMastersData = this.responceData;
                        this.validatePrerequisiteDetailsMasterId = this.responceData.validatePrerequisiteDetailsMasterId;

                        if (this.editPrereqMastersData.saveStatus == 'SAVE') {

                            this.displayMode = 'VIEW_UPDATE';
                            this.addPrereqMastersData = this.responceData.validatePrerequisiteDetailsList;

                        } else if (this.editPrereqMastersData.saveStatus == 'SUBMIT' && (this.editPrereqMastersData.latestStatus == 'Prerequisite Details Updated' || this.editPrereqMastersData.latestStatus == 'Prerequisite Details Added')  {

                            this.displayMode = 'VIEW_SUBMIT';
                            this.addPrereqMastersData = this.responceData.validatePrerequisiteDetailsList;

                        } else if (this.editPrereqMastersData.saveStatus == 'SUBMIT' && this.editPrereqMastersData.latestStatus == 'Prerequisite Details Rejected') {

                            this.displayMode = 'VIEW_SUBMIT';
                            this.addPrereqMastersData = this.responceData.validatePrerequisiteDetailsList;

                        } else if (this.editPrereqMastersData.saveStatus == 'SUBMIT' && this.editPrereqMastersData.latestStatus == 'Prerequisite Details Approved') {

                            this.displayMode = 'NO_ACTION';
                            this.addPrereqMastersData = this.responceData.validatePrerequisiteDetailsList;

                        }

                    } else {
                        this.displayMode = 'VIEW';
                        if (this._userServ.canCurrentUser('IT_INFRA_TEAM')) {
                            this.toastr.pop('warning', 'Pending', 'Pre-requisites Status Pending at BRANCH BANKING TEAM.');
                            return true;
                        }

                    }

                    this.validatePrereq.show(this.validatePrereq.options);
                });
            }
        });
    }


    savePreReq(value: any, type) {

        let data_count = this.addPrereqMastersData.length;

        if (this.displayMode == 'VIEW') {

            let postData = [];

            for (let i = 1; i <= data_count; i++) {

                let items = {
                    validatePreItemId: eval('value.itemId_' + i),
                    itemName: eval('value.itemName_' + i),
                    isInstallationDone: eval('value.itemStatus_' + i),
                    comments: ''
                };
                postData.push(items);
            }

            let sendPostData = {
                branchId: this.branchDetails.branchId,
                saveStatus: type,
                validatePrerequisiteDetailsList: postData,
                createdBy: this.currentUser.userId,
            };

            let url = 'addValidatePrerequisiteDetails';


            this.branchServ.savePrerequisiteData(sendPostData, this.branchDetails, url).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Updated Successfully.');
                this.validatePrereq.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.rerender();
                this.ngVarReset();
            });


        } else if (this.displayMode == 'VIEW_UPDATE') {

            let sendPostData = {
                branchId: this.branchDetails.branchId,
                saveStatus: type,
                validatePrerequisiteDetailsList: this.addPrereqMastersData,
                createdBy: this.currentUser.userId,
                validatePrerequisiteDetailsMasterId: this.validatePrerequisiteDetailsMasterId,
                createdOn: new Date(),
                updatedBy: this.currentUser.userId,
                updatedOn: new Date(),
                latestStatus: '',
                isApprovalProcess: 'NO'
            };

            let url = 'updateValidatePrerequisiteDetails';


            this.branchServ.savePrerequisiteData(sendPostData, this.branchDetails, url).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Updated Successfully.');
                this.validatePrereq.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.rerender();
                this.ngVarReset();
            });

        } else if (this.displayMode == 'VIEW_SUBMIT') {

            console.log(this.addPrereqMastersData);

            let latestStatus = 'Approve';

            for (let iterator of this.addPrereqMastersData) {
                if (iterator.comments == 'Reject') {
                    latestStatus = 'Reject';
                }
            }

            let sendPostData = {
                branchId: this.branchDetails.branchId,
                saveStatus: type,
                validatePrerequisiteDetailsList: this.addPrereqMastersData,
                createdBy: this.currentUser.userId,
                validatePrerequisiteDetailsMasterId: this.validatePrerequisiteDetailsMasterId,
                createdOn: new Date(),
                updatedBy: this.currentUser.userId,
                updatedOn: new Date(),
                latestStatus: '',
                isApprovalProcess: 'YES'
            };

            let url = 'updateValidatePrerequisiteDetails';

            this.branchServ.savePrerequisiteData(sendPostData, this.branchDetails, url, latestStatus).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Updated Successfully.');
                this.validatePrereq.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.rerender();
                this.ngVarReset();
            });

        } else {
            alert('Something went worng please Try again');
        }

    }

    closePreReq() {
        this.validatePrereq.hide();
        this.ngVarReset();
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

    ngVarReset() {

        this.errorMsg = '';
        this.responceData = '';

        this.displayMode = '';

        this.branchDetails = {
            branchId: '',
            createdBy: ''
        };

    }



}

