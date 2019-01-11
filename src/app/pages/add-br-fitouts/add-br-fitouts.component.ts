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
    selector: 'app-add-br-fitouts',
    templateUrl: './add-br-fitouts.component.html',
    styleUrls: ['./add-br-fitouts.component.css']
})
export class AddBrFitoutsComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any;
    private currentUser: User = new User();
    tabs: any[];
    tabsWorkorder: any[];
    loading = true;

    cso_displayMode: any[];
    ceo_displayMode: any[];

    premisesLayoutSrNo = '';
    layoutWorkOrderId = '';
    layoutWorkOrderName = '';

    showDatePicker: any;
    branchId = '';

    dateOfCompletionFitOut = new Date();
    expBrDate = '';

    columnDefs: any;

    imgfirstURL: string;
    imgsecoundURL: string;

    disableLayout = false;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    addlayoutParams = {
        premisesLayoutSrNo: '',
        layoutDetails: '',
        layoutDOC: [],
        layoutDOCString: '',
        premisesId: '',
        branchId: '',
        costEstimationDoc: [],
        costEstimationDocString: '',
        costEstimationAmt: 0
    };

    layoutParams = {
        premisesLayoutId: '',
        premisesLayoutSrNo: '',
        layoutDetails: '',
        layoutDOCString: '',
        premisesId: '',
        branchId: '',
        costEstimationDoc: [],
        costEstimationDocString: '',
        costEstimationAmt: '',
        csoUser: '',
        csoAction: '',
        csoComment: '',
        ceoUser: '',
        ceoAction: '',
        ceoComment: ''
    };


    addWorkOrder = {
        workOrderDoc: [],
        workOrderDocString: '',
        dateOfCompletionFitOut: '',
        workOrderName: '',
        premisesLayoutId: '',
        branchId: '',
        createdBy: '',
        lastUpdatedBy: '',
        workOrderAmount: 0,
        maxWorkOrderLimit: 0,
        currentWorkOrderCost: 0
    };

    workOrder = {
        layoutWorkOrderId: '',
        workOrderDoc: '',
        dateOfCompletionFitOut: '',
        premisesLayoutId: '',
        branchId: '',
        createdBy: '',
        createdOn: '',
        lastUpdatedBy: '',
        lastUpdatedOn: '',
        workOrderAmount: 0
    };


    cso_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'CSO',
        premises_layout_id: ''
    };

    ceo_action = {
        action: '',
        prevAction: '',
        userID: '',
        comment: '',
        approvalUserRole: 'MD',
        premises_layout_id: ''
    };

    config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null,
        autoReset: 3000
    };


    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }


    @ViewChild('viewDetails') viewDetails: Popup;
    @ViewChild('addLayoutSpecPopup') addLayoutSpecPopup: Popup;
    @ViewChild('addWorkOrderPopup') addWorkOrderPopup: Popup;


    ngOnInit(): void {

        if (this._userServ.canCurrentUser('ADMIN_INFRA_TEAM')) {
            this.columnDefs = [{
                'targets': [8],
                'visible': true,
                'searchable': false
            }];
        } else {
            this.columnDefs = [{
                'targets': [8],
                'visible': false,
                'searchable': false
            }];
        }

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
                data: 'rbiReferenceNo',
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
                title: 'Exp. Br. Opening Date',
                data: 'expBranchOpenDate'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-plus-circle\' aria-hidden=\'true\'></i> Layouts details </a>' + ' <sup class="label label-success">( ' + row.branchPremisesLayoutCount + ' )</sup>';
                    return row_title;
                }
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-paper-plane-o\' aria-hidden=\'true\'></i> Work Order </a>';
                    return row_title;
                }
            }, {
                title: 'Is fitout ready ?',
                data: '',
                render: function (data, type, row) {

                    if (row.isBranchStructureReady == 'Yes') {
                        return '<input class=\'inside-datatable\' type=\'checkbox\' checked disabled>';
                    } else if (row.branchPremises == null || row.branchPremises.approvedPremisesLayout == null) {
                        return '<input class=\'inside-datatable\' type=\'checkbox\' disabled>';
                    } else {
                        return '<input class=\'inside-datatable\' type=\'checkbox\'>';
                    }
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.addLayoutSpec(data);
                });

                $('td:nth-child(8)', row).unbind('click');
                $('td:nth-child(8)', row).bind('click', () => {
                    self.updateWorkForm(data);
                });

                $('td:nth-child(9)', row).unbind('click');
                $('td:nth-child(9)', row).bind('click', () => {
                    self.branchReady(data);
                });

                return row;

            }

        };
    }

    branchReady(info: any) {
        if (info.isBranchStructureReady != 'Yes') {
            var r = confirm('Press Ok if branch is ready for operation!');
            if (r === true) {

                this.branchServ.isWorkOrderPresent(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                    console.log(this.responceData.length);

                    if (this.responceData.ceo_action == 'Approve') {

                        info.updatedBy = this.currentUser.userId;

                        this.branchServ.updateBranchReadyDetails(info).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                            this.toastr.pop('success', 'Successful', 'Branch is ready for operation.');
                            this.rerender();
                        });


                    } else {
                        this.toastr.pop('warning', 'Pending', 'Workorder Approval is Pending.');
                        this.rerender();
                    }
                });

            }
        }
    }

    addLayoutSpec(info: any) {

        this.loading = true;

        this.branchId = info.branchId;

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        if (info.branchPremises == null) {
            this.toastr.pop('warning', 'In Progress', 'Premises details not found.');
            return true;
        }

        this.addlayoutParams.branchId = info.branchId;
        this.addlayoutParams.premisesId = info.branchPremises.premisesId;

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.addLayoutSpecPopup.options = {
            color: '#363794',
            header: 'Add layouts of the premises',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchServ.fetchAllPremisesLayout(this.addlayoutParams).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            this.loading = false;

            this.tabs = this.responceData;
            this.getApprovedLayout();

            this.branchServ.isLOIAccepted(this.addlayoutParams.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                if (this.responceData.status != '400') {

                    this.branchServ.allowedToAddPremisesLayout(this.addlayoutParams.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

                        if (this.responceData.status == '400') {
                            // this.toastr.pop('warning', 'Warning', 'Layout Approval Process Initiated heance addtion of Layout not allowed.');
                            this.disableLayout = false;
                        } else {
                            this.disableLayout = true;
                        }

                        this.addLayoutSpecPopup.show(this.addLayoutSpecPopup.options);

                    });
                } else {
                    this.toastr.pop('warning', 'Warning', 'LOI Status Pending.');
                }

            });

        });

    }

    getApprovedLayout() {
        for (let premises of this.responceData) {

            if (premises.csoAction == 'Approve') {

                this.premisesLayoutSrNo = premises.premisesLayoutSrNo;

                this.cso_action = {
                    action: '',
                    prevAction: premises.csoAction || '',
                    userID: this.currentUser.userId,
                    comment: premises.csoComment,
                    approvalUserRole: 'CSO',
                    premises_layout_id: premises.premisesLayoutId
                };

                this.ceo_action = {
                    action: '',
                    prevAction: premises.ceoAction || '',
                    userID: this.currentUser.userId,
                    comment: premises.ceoComment,
                    approvalUserRole: 'MD',
                    premises_layout_id: premises.premisesLayoutId
                };

            }
        }
    }

    saveLayoutSepc(value: any) {


        if (this.addlayoutParams.layoutDOCString == '') {
            this.toastr.pop('warning', 'Warning', 'Kindly upload Layout document to proceed.');
            return false;
        }

        if (this.addlayoutParams.costEstimationDocString == '') {
            this.toastr.pop('warning', 'Warning', 'Kindly upload Cost Estinations document to proceed.');
            return false;
        }


        this.branchServ.saveLayoutData(value, this.addlayoutParams).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Layout Added Successfully.');
            this.addLayoutSpecPopup.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.ngVarReset();
            this.rerender();
        });
    }

    closeLayoutSpec() {
        this.ngVarReset();
        this.addLayoutSpecPopup.hide();
    }

    updateWorkForm(info: any) {
        this.loading = true;
        this.branchId = info.branchId;

        this.expBrDate = info.expBranchOpenDate;

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;


        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.addWorkOrderPopup.options = {
            color: '#363794',
            header: 'View/Add work order.',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.addWorkOrder.branchId = info.branchId;

        if (info.branchPremises == null || info.branchPremises.approvedPremisesLayout == null) {
            this.toastr.pop('warning', 'In Progress', 'Layout Approval Pending.');
            return true;
        }

        this.addWorkOrder.maxWorkOrderLimit = info.branchPremises.approvedPremisesLayout.amount;
        this.addWorkOrder.premisesLayoutId = info.branchPremises.approvedPremisesLayout.premisesLayoutId;
        this.branchServ.fetchLayoutWorkOrder(this.addWorkOrder).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            for (let tabsOrder in this.responceData) {
                this.responceData[tabsOrder].ceo_prevAction = this.responceData[tabsOrder].ceo_action || '';
                this.responceData[tabsOrder].cso_prevAction = this.responceData[tabsOrder].cso_action || '';
                this.responceData[tabsOrder].workOrderAmount = this.responceData[tabsOrder].workOrderAmount || 0;
                this.addWorkOrder.currentWorkOrderCost = parseFloat(this.addWorkOrder.currentWorkOrderCost) + parseFloat(this.responceData[tabsOrder].workOrderAmount);
            }

            if (this.responceData.length == 0 && !this._userServ.canCurrentUser('ADMIN_INFRA_TEAM')) {
                this.toastr.pop('warning', 'Warning', 'Work Order not added.');
                return false;
            }

            this.tabsWorkorder = this.responceData;

            this.addWorkOrderPopup.show(this.addWorkOrderPopup.options);
            this.loading = false;

            setTimeout(() => {
                this.showDatePicker = true;
            });

        });
    }

    closeWorkForm() {
        this.ngVarReset();
        this.addWorkOrderPopup.hide();
    }

    saveWorkForm(value: any) {

        this.addWorkOrder.dateOfCompletionFitOut = this._utilService.formateDateCommon(this.dateOfCompletionFitOut);

        let expBranchOpeningDate = this._utilService.convertdmyToymd(this.expBrDate);

        console.log(this.dateOfCompletionFitOut);
        console.log(expBranchOpeningDate);

        if (this.dateOfCompletionFitOut > expBranchOpeningDate) {
            this.toastr.pop('warning', 'Warning', 'Date of work order is grater than branch opening date.');
            return false;
        }

        if (this.addWorkOrder.workOrderDocString == '') {
            this.toastr.pop('warning', 'Warning', 'Kindly upload workorder document to proceed.');
            return false;
        }


        this.addWorkOrder.workOrderName = value.workOrderName;
        this.addWorkOrder.createdBy = this.currentUser.userId;
        this.addWorkOrder.lastUpdatedBy = this.currentUser.userId;
        this.addWorkOrder.workOrderAmount = value.workOrderAmount;

        let validateAmount = parseFloat(this.addWorkOrder.workOrderAmount) + parseFloat(this.addWorkOrder.currentWorkOrderCost);

        if (validateAmount > this.addWorkOrder.maxWorkOrderLimit) {
            this.toastr.pop('warning', 'Warning', 'Approved project Layout cost exceeded.');
            return false;
        }

        this.branchServ.saveWorkOrderData(this.addWorkOrder).subscribe(() => {

            this.toastr.pop('success', 'Successful', 'Work Order Added Successfully.');
            this.addWorkOrderPopup.hide();

        }, reserror => this.errorMsg = reserror, () => {

            document.getElementById('workForm').reset();
            this.ngVarReset();
            this.rerender();

        });
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
        const image_uuid = JSON.parse(ev[1]);

        if (img_type == 'layoutDOC') {
            this.addlayoutParams.layoutDOC.push(image_uuid.data[0]);

            var layoutDOC = [];
            this.addlayoutParams.layoutDOCString = '';

            if (this.addlayoutParams.layoutDOC.length > 0) {

                for (let value of this.addlayoutParams.layoutDOC) {
                    layoutDOC.push(Object.values(value));
                }

                this.addlayoutParams.layoutDOCString = layoutDOC.join();
            }


        }

        if (img_type == 'costEstimation') {
            this.addlayoutParams.costEstimationDoc.push(image_uuid.data[0]);

            let costEstimation = [];
            this.addlayoutParams.costEstimationDocString = '';

            if (this.addlayoutParams.costEstimationDoc.length > 0) {

                for (let value of this.addlayoutParams.costEstimationDoc) {
                    costEstimation.push(Object.values(value));
                }

                this.addlayoutParams.costEstimationDocString = costEstimation.join();
            }
            console.log(this.addlayoutParams.costEstimationDocString);
        }


        if (img_type == 'workOrderDoc') {

            this.addWorkOrder.workOrderDoc.push(image_uuid.data[0]);

            let workOrderDoc = [];
            this.addWorkOrder.workOrderDocString = '';

            if (this.addWorkOrder.workOrderDoc.length > 0) {

                for (const value of this.addWorkOrder.workOrderDoc) {
                    workOrderDoc.push(Object.values(value));
                }
                this.addWorkOrder.workOrderDocString = workOrderDoc.join();
            }
        }

    }

    onUploadError(ev) {

    }

    saveUserAction(userAction: string, action = '', fromData = '', branchId = '', premises_layout_id = '', increment = 0) {

        let postString = '';

        if (userAction === 'cso_action') {

            this.cso_action.action = action;

            postString = 'action=' + this.cso_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.cso_action.comment + '&approvalUserRole=' + this.cso_action.approvalUserRole + '&premises_layout_id=' + this.cso_action.premises_layout_id + '&branchId=' + this.branchId;
        }

        if (userAction === 'cfo_action') {

            let cfoComment = eval('fromData.cfoComment_' + premises_layout_id);

            this.tabs[increment].cfoUser = 'CFO';
            this.tabs[increment].cfoUserComment = cfoComment;

            postString = 'action=' + '' + '&userID=' + this.currentUser.userId + '&comment=' + cfoComment + '&approvalUserRole=CFO&premises_layout_id=' + premises_layout_id + '&branchId=' + branchId;

        }

        if (userAction === 'b_head_action') {

            let businessHeadComment = eval('fromData.businessHeadComment_' + premises_layout_id);

            this.tabs[increment].businessHeadUser = 'BUSINESS_HEAD';
            this.tabs[increment].businessHeadComment = businessHeadComment;

            postString = 'action=' + ' ' + '&userID=' + this.currentUser.userId + '&comment=' + businessHeadComment + '&approvalUserRole=BranchBankingHead&premises_layout_id=' + premises_layout_id + '&branchId=' + branchId;

        }

        if (userAction === 'ceo_action') {

            this.ceo_action.action = action;

            postString = 'action=' + this.ceo_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.ceo_action.comment + '&approvalUserRole=' + this.ceo_action.approvalUserRole + '&premises_layout_id=' + this.ceo_action.premises_layout_id + '&branchId=' + this.branchId;

        }

        this.branchServ.layoutActionPerform(postString).subscribe(() => { }, reserror => this.errorMsg = reserror, () => {
            this.toastr.pop('success', 'Successful', 'Updated Successfully.');
            if (branchId == '') {
                this.addLayoutSpecPopup.hide();
                this.ngVarReset();
                this.rerender();
            }


        });

    }

    workOrderActionPerform(layoutWorkOrderId, userAction: string, action = '', increment = 0) {

        let postString = '';

        if (userAction === 'cso_action') {

            // this.cso_displayMode[layoutWorkOrderId] = 'VIEW';
            this.cso_action.action = action;
            this.tabsWorkorder[increment].cso_prevAction = action;
            this.tabsWorkorder[increment].cso_comment = this.cso_action.comment;

            postString = 'action=' + this.cso_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.cso_action.comment + '&approvalUserRole=' + this.cso_action.approvalUserRole + '&layoutWorkOrderId=' + layoutWorkOrderId + '&branchId=' + this.branchId;
        }

        if (userAction === 'ceo_action') {

            // this.ceo_displayMode[layoutWorkOrderId] = 'VIEW';
            this.ceo_action.action = action;
            this.tabsWorkorder[increment].ceo_prevAction = action;
            this.tabsWorkorder[increment].ceo_comment = this.ceo_action.comment;

            postString = 'action=' + this.ceo_action.action + '&userID=' + this.currentUser.userId + '&comment=' + this.ceo_action.comment + '&approvalUserRole=' + this.ceo_action.approvalUserRole + '&layoutWorkOrderId=' + layoutWorkOrderId + '&branchId=' + this.branchId;

        }

        this.branchServ.workOrderActionPerform(postString).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Updated Successfully.');
            // this.addWorkOrderPopup.hide();
        }, reserror => this.errorMsg = reserror, () => {
            // this.ngVarReset();
            // this.rerender();
        });


    }

    ngVarReset() {

        this.addlayoutParams = {
            premisesLayoutSrNo: '',
            layoutDetails: '',
            layoutDOC: [],
            layoutDOCString: '',
            premisesId: '',
            branchId: '',
            costEstimationDoc: [],
            costEstimationDocString: '',
            costEstimationAmt: 0
        };

        this.layoutParams = {
            premisesLayoutId: '',
            premisesLayoutSrNo: '',
            layoutDetails: '',
            layoutDOCString: '',
            premisesId: '',
            branchId: '',
            costEstimationDoc: [],
            costEstimationDocString: '',
            costEstimationAmt: '',
            csoUser: '',
            csoAction: '',
            csoComment: '',
            ceoUser: '',
            ceoAction: '',
            ceoComment: '',
        };

        this.addWorkOrder = {
            workOrderDoc: [],
            workOrderDocString: '',
            dateOfCompletionFitOut: '',
            workOrderName: '',
            premisesLayoutId: '',
            branchId: '',
            createdBy: '',
            lastUpdatedBy: '',
            workOrderAmount: 0,
            maxWorkOrderLimit: 0,
            currentWorkOrderCost: 0
        };

        this.workOrder = {
            layoutWorkOrderId: '',
            workOrderDoc: '',
            dateOfCompletionFitOut: '',
            premisesLayoutId: '',
            branchId: '',
            createdBy: '',
            createdOn: '',
            lastUpdatedBy: '',
            lastUpdatedOn: '',
            workOrderAmount: 0
        };

        this.dateOfCompletionFitOut = new Date();

        this.errorMsg = '';
        this.responceData = '';
        this.loading = true;
        this.showDatePicker = false;


        this.cso_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'CSO',
            premises_layout_id: '',
        };

        this.ceo_action = {
            action: '',
            prevAction: '',
            userID: '',
            comment: '',
            approvalUserRole: 'MD',
            premises_layout_id: '',
        };

        this.layoutWorkOrderId = '';
        this.premisesLayoutSrNo = '';
    }

    resetTabData() {
        this.cso_action.action = '';
        this.cso_action.comment = '';
        this.ceo_action.action = '';
        this.ceo_action.comment = '';
    }

    validateLayoutId($event) {

        const layoutCode = $event;
        this.branchServ.isPremisesLayoutCodePresent(layoutCode).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status === '400') {
                $('#premisesLayoutSrNo').val('');
                this.toastr.pop('warning', 'Warning', 'Layout id already exists.');
            }
        });
    }

}
