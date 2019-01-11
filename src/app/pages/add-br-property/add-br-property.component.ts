import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent, AccordionComponent } from 'ng2-bootstrap';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { BranchService } from '../../services/branch.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-add-br-property',
    templateUrl: './add-br-property.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./add-br-property.component.css']
})
export class AddBrPropertyComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    response: any;
    private currentUser: User = new User();
    tabs: any[];

    premisesList: any = [];
    commQuestionList: any = [];
    techQuestionList: any = [];

    primisesName = '';

    loading = true;
    showDatePicker: any;

    imgfirstURL: string;
    imgsecoundURL: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOpts1 = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOpts2 = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    openRecommended = false;
    networkdisplayMode = 'EDIT';

    stateList = [];

    startDateOfLeave = new Date();
    endDateOfLeave = new Date();
    tempLeaveDate = '';
    rentStartDate = new Date();
    dateOfAgreement = new Date();

    branchParams = {
        branchState: '',
        branchDistrict: '',
        branchCity: '',
        branchLocation: '',
        branchType: '',
        branchClassification: '',
        rbiReferenceNo: '',
        strength: '',
        inputFiles: '',
        isDocumentUploaded: '',
        status: '',
        approxArea: '',
        typeOfBusiness: '',
        headPersonCount: '',
        employeeCount: '',
        budget: '',
        period: '',
        expBranchOpenDate: '',
        properties_details: [],
        premisesQuestionList: [],
        branchId: '',
        proposedBranchName: '',
        nearestLocation: ''
    };

    addbranchParams = {
        branchId: '',
        approvalDocId: [],
        approvalDocString: '',
        dimensionPhotoId: [],
        dimensionPhotoString: '',
        layoutPhotoId: [],
        layoutPhotoIdString: ''
    };

    updateNetworkdata = {
        premisesId: '',
        branchId: '',
        networkFeasibilityId: '',
        isNetworkProcessInitiated: '',
        isNetworkFeasible: '',
    };

    cso_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'CSO',
        branchPremiseId: '',
    };

    ceo_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'MD',
        branchPremiseId: '',
    };

    config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null,
        autoReset: 30000
    };

    branchId = '';

    columns: any = [];
    columnDefs: any = [];

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('addPremisesSpec') addPremisesSpec: Popup;
    @ViewChild('viewDetails') viewDetails: Popup;
    @ViewChild('updateNetworkPopUp') updateNetworkPopUp: Popup;

    ngOnInit(): void {


        if (this._userServ.canCurrentUser('IT_INFRA_TEAM')) {

            this.columnDefs = [{
                'targets': [7],
                'visible': true,
                'searchable': false
            }, {
                'targets': [6],
                'visible': false,
                'searchable': false
            }];

        } else if (this._userServ.canCurrentUser('CHIEF_SERVICE_OFFICER') || this._userServ.canCurrentUser('CHIEF_FINANCIAL_OFFICER') || this._userServ.canCurrentUser('BUSINESS_HEAD') || this._userServ.canCurrentUser('MD_AND_CEO')) {

            this.columnDefs = [{
                'targets': [7],
                'visible': false,
                'searchable': false
            }, {
                'targets': [6],
                'visible': false,
                'searchable': false
            }];


        } else if (this._userServ.canCurrentUser('ADMIN_INFRA_TEAM')) {

            this.columnDefs = [{
                targets: [6],
                visible: true,
                searchable: false
            }, {
                targets: [7],
                visible: false,
                searchable: false
            }];

        }

        this.columns = [{
            title: 'RBI Ref. No.',
            data: 'rbiReferenceNo',
            render: function (data, type, row) {
                if (row.rbiReferenceNo != null) {
                    return '<a href="javascript:void(0)"><strong>' + row.rbiReferenceNo + '</strong><a>';
                } else {
                    return '<a href="javascript:void(0)"><strong>------</strong><a>';
                }
            }
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
                let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-plus-circle\' aria-hidden=\'true\'></i> Add Premises Specification</a>' + ' <sup class="label label-success">( ' + row.branchPremisesCount + ' )</sup>';
                return row_title;
            }
        }, {
            title: 'Action',
            data: '',
            render: function (data, type, row) {
                let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-pencil-square-o\' aria-hidden=\'true\'></i> Update Network Feasibility </a>';
                return row_title;
            }
        }];


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
            columns: this.columns,
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.viewBranchDetails(data);
                });

                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.addPremisesSepc(data);
                });

                return row;

            }

        };
    }

    viewBranchDetails(info: any) {

        this.branchId = info.branchId;

        this.loading = true;

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        this.viewDetails.options = {
            color: '#363794',
            header: 'View Branch Details',
            showButtons: false,
            confirmBtnContent: 'OK',
            cancleBtnContent: 'Cancel',
            confirmBtnClass: 'btn btn-default',
            cancleBtnClass: 'btn btn-default',
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchParams = {
            branchState: info.branchState,
            branchDistrict: info.branchDistrict,
            branchCity: info.branchCity,
            branchLocation: info.branchLocation,
            branchType: info.branchType,
            branchClassification: info.branchClassification,
            rbiReferenceNo: info.rbiReferenceNo,
            strength: info.strength,
            inputFiles: info.inputFiles,
            isDocumentUploaded: info.isDocumentUploaded,
            status: info.status,
            approxArea: info.approxArea,
            typeOfBusiness: info.typeOfBusiness,
            headPersonCount: info.headPersonCount,
            employeeCount: info.employeeCount,
            budget: info.budget,
            period: info.period,
            expBranchOpenDate: info.expBranchOpenDate,
            properties_details: [],
            premisesQuestionList: [],
            branchId: info.branchId,
            proposedBranchName: info.proposedBranchName,
            nearestLocation: info.nearestLocation
        };

        this.branchServ.fetchBranchPremises(this.branchParams.branchId).subscribe(resdata => this.branchParams.properties_details = resdata, reserror => this.errorMsg = reserror, () => {

            this.loading = false;
            // this.tabs = this.branchParams.properties_details;
            let rent = 0;
            let periodOfLease = 0;
            let escalationRent = 0;
            for (let tabsData in this.branchParams.properties_details) {
                rent = this.branchParams.properties_details[tabsData].rentPerMonth;
                periodOfLease = this.branchParams.properties_details[tabsData].periodOfLease;
                escalationRent = this.branchParams.properties_details[tabsData].escalationRent;
                let year = (this.branchParams.properties_details[tabsData].durationOfTenture / 12);
                rent = (rent * 12);
                year = Math.ceil(year);
                let escaldationYear = ' '.repeat(year).split('');
                let storeescaldationYear = [];
                for (let index = 1; index < escaldationYear.length; index++) {
                    rent = ((rent) + (((rent) * escalationRent) / 100));
                    storeescaldationYear.push(rent);
                }
                this.branchParams.properties_details[tabsData].escalationRentData = storeescaldationYear;
            }
            this.tabs = this.branchParams.properties_details;

            this.getApprovedPremises();
            this.viewDetails.show(this.viewDetails.options);
        });

    }

    getApprovedPremises() {

        for (let premises of this.branchParams.properties_details) {
            if (premises.csoAction == 'Approve' && premises.latestStatus == 'Approve') {

                this.primisesName = premises.propertyName;

                this.cso_action = {
                    action: '',
                    prevAction: premises.csoAction || '',
                    userID: '',
                    comment: premises.csoComment,
                    approvalUserRole: 'CSO',
                    branchPremiseId: premises.premisesId
                };

                this.ceo_action = {
                    action: '',
                    prevAction: premises.mdAction || '',
                    userID: '',
                    comment: premises.mdComment,
                    approvalUserRole: 'MD',
                    branchPremiseId: premises.premisesId
                };

            }
        }

    }

    addPremisesSepc(info: any) {

        if (this._userServ.canCurrentUser('ADMIN_INFRA_TEAM')) {

            this.addbranchParams.branchId = info.branchId;

            this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

            this.addPremisesSpec.options = {
                color: '#363794',
                header: 'Add Premises Specification',
                showButtons: false,
                widthProsentage: 100,
                animation: 'bounceInDown',
            };

            if (info.expBranchOpenDate == '') {
                this.toastr.pop('warning', 'Warning', 'Additional Branch Details Pending At BRANCH BANKING TEAM.');
                return true;
            }

            this.branchParams.branchState = info.branchState;
            this.branchParams.branchCity = info.branchCity;

            this.branchServ.fetchStateList().subscribe(resdata => this.stateList = resdata, reserror => this.errorMsg = reserror, () => { });

            this.branchServ.allowedToAddPremises(this.addbranchParams.branchId).subscribe(resdata => this.response = resdata, reserror => this.errorMsg = reserror, () => {

                if (this.response.status == '200') {

                    this.branchServ.fetchPremisesQuestionList().subscribe(resdata => this.response = resdata, () => { }, () => {

                        for (let key in this.response) {
                            if (this.response[key].questionType == 'Commercial') {
                                this.commQuestionList.push(this.response[key]);
                            } else if (this.response[key].questionType == 'Technical') {
                                this.techQuestionList.push(this.response[key]);
                            }
                        }


                        this.addPremisesSpec.show(this.addPremisesSpec.options);
                        setTimeout(() => {
                            this.showDatePicker = true;
                        }, 1000);
                    });

                } else {

                    this.toastr.pop('warning', 'Warning', 'Premises Approval Initiated heance addtion of primises not allowed.');

                }

            });

        } else if (this._userServ.canCurrentUser('IT_INFRA_TEAM')) {

            this.addbranchParams.branchId = info.branchId;

            this.loading = true;

            this.premisesList = [];

            this.updateNetworkPopUp.options = {
                color: '#363794',
                header: 'Update Network Feasibility',
                showButtons: false,
                widthProsentage: 100,
                animation: 'bounceInDown',
            };

            this.branchServ.fetchBranchPremises(info.branchId).subscribe(resdata => this.response = resdata, reserror => this.errorMsg = reserror, () => {

                for (let item of this.response) {
                    if (item.mdAction == 'Approve') {

                        if (item.networkFeasibilty == null) {

                            item.networkFeasibilty = {
                                networkFeasibilityId: '',
                                isNetworkProcessInitiated: '',
                                isNetworkFeasible: '',
                                premisesId: item.premisesId,
                                branchId: this.addbranchParams.branchId
                            };

                            this.networkdisplayMode = 'EDIT';

                        } else {

                            item.networkFeasibilty = {
                                networkFeasibilityId: item.networkFeasibilty.networkFeasibilityId,
                                isNetworkProcessInitiated: item.networkFeasibilty.isNetworkProcessInitiated,
                                isNetworkFeasible: item.networkFeasibilty.isNetworkFeasible,
                                premisesId: item.premisesId,
                                branchId: this.addbranchParams.branchId
                            };

                            this.networkdisplayMode = 'VIEW';

                        }

                        this.premisesList.push(item);

                    }
                }

                if (this.premisesList.length > 0) {

                    this.updateNetworkPopUp.show(this.updateNetworkPopUp.options);
                    this.loading = false;

                } else {
                    this.toastr.pop('warning', 'Warning', 'Approved Premises Not Found.');
                }
            });

        }

    }

    canceladdPremisesSpec() {
        this.ngVarReset();
        this.addPremisesSpec.hide();
    }
    closeViewPremises() {
        this.ngVarReset();
        this.viewDetails.hide();
    }
    cancelNetworkFeasibilityForm() {
        this.ngVarReset();
        this.updateNetworkPopUp.hide();
    }

    savePremisesSepc(value: any) {

        let premisesQuestionList = [];

        for (let index = 0; index < this.response.length; index++) {
            let key = index + 1;
            this.response[index].questionAns = eval('value.qitem_' + key);
            premisesQuestionList.push(this.response[index]);
        }

        value.state = this.branchParams.branchState;
        value.city = this.branchParams.branchCity;
        value.premisesQuestionList = premisesQuestionList;
        value.startDateOfLeave = this._utilService.formateDateCommon(this.startDateOfLeave);
        value.endDateOfLeave = this._utilService.formateDateCommon(this.endDateOfLeave);
        value.rentStartDate = this._utilService.formateDateCommon(this.rentStartDate);
        value.dateOfAgreement = this._utilService.formateDateCommon(this.dateOfAgreement);
        value.createdBy = this.currentUser.userId;
        this.branchServ.saveBranchPremises(value, this.addbranchParams).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Premises Added Successfully.');
            this.addPremisesSpec.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.ngVarReset();
            this.rerender();
        });

    }


    saveNetworkFeasibilityForm(premisesId, branchId, networkFeasibilty) {

        this.updateNetworkdata.premisesId = premisesId;
        this.updateNetworkdata.branchId = branchId;
        this.updateNetworkdata.networkFeasibilityId = networkFeasibilty.networkFeasibilityId;
        this.updateNetworkdata.isNetworkProcessInitiated = networkFeasibilty.isNetworkProcessInitiated;
        this.updateNetworkdata.isNetworkFeasible = networkFeasibilty.isNetworkFeasible;

        if (networkFeasibilty.networkFeasibilityId != null && networkFeasibilty.networkFeasibilityId !== '') {

            this.branchServ.updateNetworkFeasibility(this.updateNetworkdata).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Updated Successfully.');
                this.updateNetworkPopUp.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.ngVarReset();
                this.rerender();
            });

        } else {

            this.branchServ.saveNetworkFeasibility(this.updateNetworkdata).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Updated Successfully.');
                this.updateNetworkPopUp.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.ngVarReset();
                this.rerender();
            });

        }

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

    onUploadSuccessinputFiles(ev: any, img_type: string) {
        let image_uuid = JSON.parse(ev[1]);

        if (img_type == 'approvalDocId') {
            this.addbranchParams.approvalDocId.push(image_uuid.data[0]);

            let approvalDocId = [];
            this.addbranchParams.approvalDocString = '';

            if (this.addbranchParams.approvalDocId.length > 0) {

                for (let value of this.addbranchParams.approvalDocId) {
                    approvalDocId.push(Object.values(value));
                }

                this.addbranchParams.approvalDocString = approvalDocId.join();
            }

        }

        if (img_type == 'dimensionPhotoId') {
            this.addbranchParams.dimensionPhotoId.push(image_uuid.data[0]);

            let dimensionPhotoId = [];
            this.addbranchParams.dimensionPhotoString = '';

            if (this.addbranchParams.dimensionPhotoId.length > 0) {

                for (let value of this.addbranchParams.dimensionPhotoId) {
                    dimensionPhotoId.push(Object.values(value));
                }
                this.addbranchParams.dimensionPhotoString = dimensionPhotoId.join();
            }
        }

        if (img_type == 'layoutPhotoId') {
            this.addbranchParams.layoutPhotoId.push(image_uuid.data[0]);

            let layoutPhotoId = [];
            this.addbranchParams.layoutPhotoIdString = '';

            if (this.addbranchParams.layoutPhotoId.length > 0) {

                for (let value of this.addbranchParams.layoutPhotoId) {
                    layoutPhotoId.push(Object.values(value));
                }

                this.addbranchParams.layoutPhotoIdString = layoutPhotoId.join();
            }
        }


    }

    onUploadError(ev) {

    }

    saveUserAction(userAction: string, action = '', fromData = '', branchId = '', premisesId = '', increment = 0) {

        console.log(userAction);

        console.log(fromData);

        debugger;

        let postString = '';

        if (userAction == 'cso_action') {

            this.cso_action.action = action;

            postString = 'action=' + this.cso_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.cso_action.comment + '&approvalUserRole=' + this.cso_action.approvalUserRole + '&branchPremiseId=' + this.cso_action.branchPremiseId + '&branchId=' + this.branchId;
        }


        if (userAction == 'cfo_action') {

            let cfoComment = eval('fromData.cfoComment_' + premisesId);

            this.tabs[increment].cfoUser = 'CFO';
            this.tabs[increment].cfoComment = cfoComment;

            this.openRecommended = true;

            postString = 'action=' + '' + '&userID=' + this.currentUser.userId + '&comment=' + cfoComment + '&approvalUserRole=' + 'CFO' + '&branchPremiseId=' + premisesId + '&branchId=' + branchId;

        }

        if (userAction == 'b_head_action') {

            let businessHeadComment = eval('fromData.businessHeadComment_' + premisesId);

            this.tabs[increment].businessHeadUser = 'BUSINESS_HEAD';
            this.tabs[increment].businessHeadComment = businessHeadComment;

            this.openRecommended = true;

            postString = 'action=' + ' ' + '&userID=' + this.currentUser.userId + '&comment=' + businessHeadComment + '&approvalUserRole=' + 'BranchBankingHead' + '&branchPremiseId=' + premisesId + '&branchId=' + branchId;

        }

        if (userAction == 'ceo_action') {

            this.ceo_action.action = action;

            postString = 'action=' + this.ceo_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.ceo_action.comment + '&approvalUserRole=' + this.ceo_action.approvalUserRole + '&branchPremiseId=' + this.ceo_action.branchPremiseId + '&branchId=' + this.branchId;

        }

        this.branchServ.actionPerform(postString).subscribe(() => {
            // this.viewDetails.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.toastr.pop('success', 'Successful', 'Updated Successfully.');
            if (branchId == '') {
                this.viewDetails.hide();
                this.ngVarReset();
                this.rerender();
            }
        });

    }

    ngVarReset() {

        this.errorMsg = '';
        this.tabs = [];
        this.premisesList = [];
        this.loading = true;
        this.primisesName = '';

        this.openRecommended = false;

        this.branchParams = {
            branchState: '',
            branchDistrict: '',
            branchCity: '',
            branchLocation: '',
            branchType: '',
            branchClassification: '',
            rbiReferenceNo: '',
            strength: '',
            inputFiles: '',
            isDocumentUploaded: '',
            status: '',
            approxArea: '',
            typeOfBusiness: '',
            headPersonCount: '',
            employeeCount: '',
            budget: '',
            period: '',
            expBranchOpenDate: '',
            properties_details: [],
            premisesQuestionList: [],
            branchId: '',
            proposedBranchName: '',
            nearestLocation: ''
        };

        this.commQuestionList = [];
        this.techQuestionList = [];

        this.addbranchParams = {
            branchId: '',
            approvalDocId: [],
            approvalDocString: '',
            dimensionPhotoId: [],
            dimensionPhotoString: '',
            layoutPhotoId: [],
            layoutPhotoIdString: ''
        };

        this.cso_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'CSO',
            branchPremiseId: '',
        };

        this.ceo_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'MD',
            branchPremiseId: '',
        };

        this.startDateOfLeave = new Date();
        this.endDateOfLeave = new Date();
        this.rentStartDate = new Date();
        this.dateOfAgreement = new Date();

    }

    resetTabData() {
        this.updateNetworkdata = {
            premisesId: '',
            branchId: '',
            networkFeasibilityId: '',
            isNetworkProcessInitiated: '',
            isNetworkFeasible: '',
        };
    }

    rentStartDateChange(date) {

        this.startDateOfLeave = date;
        this.datepickerOpts2 = {
            startDate: this.startDateOfLeave,
            autoclose: true,
            format: 'd-mm-yyyy'
        };

        let durationOfTenture = document.getElementsByName('durationOfTenture')[0].value;

        let enddate = new Date(date);

        enddate.setMonth(enddate.getMonth() + parseInt(durationOfTenture, 10));
        this.endDateOfLeave = enddate;

        console.log(this.startDateOfLeave);
        console.log(this.endDateOfLeave);

    }

    rentEndDateChange(date) {
        // this.dateTo = date;
    }


}
