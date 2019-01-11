import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from './user.service';

@Injectable()
export class BranchService {

    private ticket: string;

    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }


    deleteBranchWorkflow(worflowId: any) {

        let postData = {
            'id': worflowId
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(environment.api_base_url_new + 'alfresco/s/suryoday/deleteWorkflow?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }



    /*
     * Branch Masters API
     *
     */

    updateBranchType(postData: any) {

        var headers = new Headers();
        let form = new FormData();
        form.append('id', postData.id);
        form.append('staff_strength', postData.staff_strength);
        form.append('modified_by', postData.modified_by);

        return this._http.post(environment.frontend_api_base_url + 'branch_type/update', form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    createBranchType(postData: any) {

        let headers = new Headers();
        let form = new FormData();
        form.append('branch_type', postData.branch_type);
        form.append('staff_strength', postData.staff_strength);
        form.append('modified_by', postData.modified_by);

        return this._http.post(environment.frontend_api_base_url + 'branch_type/save', form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    createBranch(postData: any, userId) {

        let headers = new Headers();

        let sendPostData = {
            branchState: postData.branch_State,
            branchDistrict: postData.branchDistrict,
            branchCity: postData.branch_City,
            branchLocation: postData.branch_Location,
            branchType: postData.branch_Type,
            branchClassification: postData.branchClassification,
            rbiReferenceNo: postData.rbiReferenceNo,
            inputFiles: postData.previnputFiles,
            isDocumentUploaded: postData.isDocumentUploaded,
            userId: userId,
            isActive: 1,
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addBranch', sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    updateBranch(sendPostData: any) {

        let headers = new Headers();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateBranch?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateBranchCS(sendPostData: any, lastUpdatedBy) {

        let headers = new Headers();
        let form = new FormData();
        form.append('branchCode', sendPostData.branchCode);
        form.append('branchName', sendPostData.branchName);
        form.append('branchAddress', sendPostData.branchAddress);
        form.append('city', sendPostData.city);
        form.append('state', sendPostData.state);
        form.append('country', sendPostData.country);
        form.append('contactDetails', sendPostData.contactDetails);
        form.append('courierServicable', sendPostData.courierServicable);
        form.append('isActive', sendPostData.isActive);
        form.append('lastUpdatedBy', lastUpdatedBy);
        form.append('dlmsBranchId', sendPostData.dlmsBranchId);

        let postData = {
            branchCode: sendPostData.branchCode,
            branchName: sendPostData.branchName,
            branchAddress: sendPostData.branchAddress,
            city: sendPostData.city,
            state: sendPostData.state,
            country: sendPostData.country,
            contactDetails: sendPostData.contactDetails,
            courierServicable: sendPostData.courierServicable,
            isActive: 1,
            lastUpdatedBy: lastUpdatedBy,
            dlmsBranchId: sendPostData.dlmsBranchId
        };
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/updateBranchMasterModified?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    addBranchAddDetails(postData: any) {

        let headers = new Headers();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateAddtionalBranchDetails?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchBranchPremises(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchBranchPremises/' + branchId + '?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchAllBill(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchAllBill?branchId=' + branchId + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    fetchValidatePrerequisite(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchValidatePrerequisiteStatus?branchId=' + branchId + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    checkBranchAssetsStatusUpdated(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/checkBranchAssetsStatusUpdated?branchId=' + branchId + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }



    saveBranchPremises(postData: any, addbranchParams) {

        let headers = new Headers();

        let sendPostData = {
            propertyName: postData.propertyName,
            area: postData.area,
            layoutPhotoId: addbranchParams.layoutPhotoIdString,
            dimensionPhotoId: addbranchParams.dimensionPhotoString,
            addressLine1: postData.addressLine1,
            addressLine2: postData.addressLine2,
            addressLine3: postData.addressLine3,
            city: postData.city,
            state: postData.state,
            pincode: postData.pincode,
            startDateOfLeave: postData.startDateOfLeave,
            endDateOfLeave: postData.endDateOfLeave,
            durationOfTenture: postData.durationOfTenture,
            rentPerMonth: postData.rentPerMonth,
            escalationRent: postData.escalationRent,
            rentStartDate: postData.rentStartDate,
            refundabaleDeposite: postData.refundabaleDeposite,
            lockingPeriod: postData.lockingPeriod,
            referredBy: postData.referredBy,
            approvalDocId: addbranchParams.approvalDocString,
            justification: postData.justification,
            ownerName: postData.ownerName,
            ownerAddress: postData.ownerAddress,
            ownerBankAccNo: postData.ownerBankAccNo,
            ownerIFSCNO: postData.ownerIFSCNO,
            ownerPanCardNo: postData.ownerPanCardNo,
            paymentOfRent: postData.paymentOfRent,
            applicableTax: postData.applicableTax,
            electircityBill: postData.electircityBill,
            maintananceCharge: postData.maintananceCharge,
            noteryRegCharge: postData.noteryRegCharge,
            noticeForTermination: postData.noticeForTermination,
            isWhiteWashingDone: postData.isWhiteWashingDone,
            isParkingAreaAvailable: postData.isParkingAreaAvailable,
            brokerage: postData.brokerage,
            electricityMeter: postData.needOfElectricMeter,
            securityDeposite: postData.refundabaleDeposite,
            periodOfLease: postData.durationOfTenture,
            premisesQuestionList: postData.premisesQuestionList,
            branchId: addbranchParams.branchId,
            createdBy: postData.createdBy
        };


        return this._http.post(environment.api_base_url_new + 'BranchCreation/addBranchPremises?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    actionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/actionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchLoi(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/generate/' + branchId + '?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchLoiAddtionaDetails(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchLoiAdditionalDetails/' + branchId + '?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchNetworkFeasibility(info) {
        let headers = new Headers();
        let postData = {
            premisesId: info.branchPremises.premisesId,
            branchId: info.branchId
        };
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchNetworkFeasibility?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateLoi(values: any, lovData) {
        let headers = new Headers();
        let postData = {
            isLoiAcceptedByOwner: values.isLoiAcceptedByOwner,
            isLSRCleared: values.isLSRCleared,
            comments: values.comments,
            nocDocuments: lovData.nocDocumentsString || '',
            isLicenseaggRegistered: values.isLicenseaggRegistered,
            regDocuments: lovData.regDocumentsString || '',
            isPossesionToSSFBL: values.isPossesionToSSFBL,
            lovId: lovData.lovId,
            saveStatus: values.saveStatus
        };


        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateLOIAdditionalDetails?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    saveNetworkFeasibility(values: any) {
        let headers = new Headers();

        let sendPostData = {
            isNetworkProcessInitiated: values.isNetworkProcessInitiated,
            isNetworkFeasible: values.isNetworkFeasible,
            premisesId: values.premisesId,
            branchId: values.branchId
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addNetworkFeasibility?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateNetworkFeasibility(values: any) {
        let headers = new Headers();

        let sendPostData = {
            isNetworkProcessInitiated: values.isNetworkProcessInitiated,
            isNetworkFeasible: values.isNetworkFeasible,
            premisesId: values.premisesId,
            branchId: values.branchId,
            networkFeasibilityId: values.networkFeasibilityId
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateNetworkFeasibility?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    saveLayoutData(postData: any, addbranchParams) {

        let headers = new Headers();

        let sendPostData = {
            premisesLayoutSrNo: postData.premisesLayoutSrNo,
            layoutDetails: postData.layoutDetails,
            layoutDOC: addbranchParams.layoutDOCString,
            costEstimationDoc: addbranchParams.costEstimationDocString,
            amount: postData.costEstimationAmt,
            premisesId: addbranchParams.premisesId,
            branchId: addbranchParams.branchId
        };

        debugger;

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addPremisesLayout?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }



    fetchAllPremisesLayout(addbranchParams) {

        let headers = new Headers();

        let sendPostData = {

        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchAllPremisesLayout?alf_ticket=' + this.ticket + '&branchId=' + addbranchParams.branchId + '&premisesId=' + addbranchParams.premisesId, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    isWorkOrderPresent(branchId) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/isWorkOrderPresent?alf_ticket=' + this.ticket + '&branchId=' + branchId, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    fetchAllLayoutCost(addCostParams) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchAllLayoutCost?alf_ticket=' + this.ticket + '&branchId=' + addCostParams.branchId + '&premisesLayoutId=' + addCostParams.premisesLayoutId, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchAllProjectApprovalNote(addApprovalNoteParams) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchAllProjectApprovalNote?alf_ticket=' + this.ticket + '&branchId=' + addApprovalNoteParams.branchId + '&layoutCostEstId=' + addApprovalNoteParams.layoutCostEstId, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchLayoutWorkOrder(addWorkOrder) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchLayoutWorkOrder/' + addWorkOrder.branchId + '?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchBranchAssetsForm(branchId) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchBranchAssetFormList?branchId=' + branchId + '&alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    layoutActionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/layoutActionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    billingActionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/billingActionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    layoutCostEstimationActionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/layoutCostEstimationActionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    projetcApprovalNoteActionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/projetcApprovalNoteActionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    workOrderActionPerform(values) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/workOrderActionPerform?' + values + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    saveCostEstData(addCostParams) {

        let headers = new Headers();

        let sendPostData = {
            premisesLayoutId: addCostParams.premisesLayoutId,
            amount: addCostParams.costEstimationAmt,
            branchId: addCostParams.branchId,
            costEstimationDoc: addCostParams.costEstimationDocString,
            createdBy: addCostParams.createdBy
        };

        debugger;

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addLayoutCostEstimation?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    editCostEstData(addCostParams) {

        let headers = new Headers();

        let sendPostData = {
            layoutCostEstimationId: addCostParams.layoutCostEstimationId,
            amount: addCostParams.costEstimationAmt,
            premisesLayoutId: addCostParams.premisesLayoutId,
            branchId: addCostParams.branchId,
            costEstimationDoc: addCostParams.costEstimationDoc,
            createdBy: addCostParams.createdBy
        };


        return this._http.post(environment.api_base_url_new + 'BranchCreation/editLayoutCostEstimation?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    saveAppNoteData(addApprovalNoteParams) {

        let headers = new Headers();

        let sendPostData = {
            layoutCostEstId: addApprovalNoteParams.layoutCostEstId,
            branchId: addApprovalNoteParams.branchId,
            comparativeStmtDoc: addApprovalNoteParams.comparativeStmtDocString,
            projectApprovalDoc: addApprovalNoteParams.projectApprovalDocString,
            createdBy: addApprovalNoteParams.createdBy
        };

        debugger;

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addProjectApprovalNote?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    editAppNoteData(addApprovalNoteParams) {

        let headers = new Headers();

        let sendPostData = {
            projectApprovalNoteId: addApprovalNoteParams.projectApprovalNoteId,
            layoutCostEstId: addApprovalNoteParams.layoutCostEstId,
            branchId: addApprovalNoteParams.branchId,
            comparativeStmtDoc: addApprovalNoteParams.comparativeStmtDoc,
            projectApprovalDoc: addApprovalNoteParams.projectApprovalDoc,
            createdBy: addApprovalNoteParams.createdBy
        };


        return this._http.post(environment.api_base_url_new + 'BranchCreation/editProjectApprovalNote?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    saveWorkOrderData(addWorkOrder) {

        let headers = new Headers();

        let sendPostData = {
            workOrderDoc: addWorkOrder.workOrderDocString,
            dateOfCompletionFitOut: addWorkOrder.dateOfCompletionFitOut,
            premisesLayoutId: addWorkOrder.premisesLayoutId,
            branchId: addWorkOrder.branchId,
            createdBy: addWorkOrder.createdBy,
            lastUpdatedBy: addWorkOrder.lastUpdatedBy,
            workOrderName: addWorkOrder.workOrderName,
            workOrderAmount: addWorkOrder.workOrderAmount
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addLayoutWorkOrder?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    editWorkOrderData(addWorkOrder) {

        let headers = new Headers();

        let sendPostData = {
            layoutWorkOrderId: addWorkOrder.layoutWorkOrderId,
            workOrderDoc: addWorkOrder.workOrderDoc,
            dateOfCompletionFitOut: addWorkOrder.dateOfCompletionFitOut,
            premisesLayoutId: addWorkOrder.premisesLayoutId,
            branchId: addWorkOrder.branchId,
            createdBy: addWorkOrder.createdBy,
            lastUpdatedBy: addWorkOrder.lastUpdatedBy,
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateLayoutWorkOrder?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getAssetList() {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchBranchAssets?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    addBranchAssetsForm(values, branchId, userId) {

        let headers = new Headers();

        let sendPostData = {
            branchAssetFormList: values,
            branchId: branchId,
            createdBy: userId
        };

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addBranchAssetFormList?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    saveBillingData(addBillingParams) {

        let headers = new Headers();

        let sendPostData = {
            branchId: addBillingParams.branchId,
            branchPaymentReceipt: addBillingParams.branchPaymentReceiptString,
            createdBy: addBillingParams.createdBy
        };

        debugger;

        return this._http.post(environment.api_base_url_new + 'BranchCreation/addBillEntry?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    savePrerequisiteData(postData, branchDetails, url, latestStatus = '') {

        let headers = new Headers();

        return this._http.post(environment.api_base_url_new + 'BranchCreation/' + url + '?branchId=' + branchDetails.branchId + '&createdBy=' + branchDetails.createdBy + '&uiStatus=' + latestStatus + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    getAssestsProjection(info) {
        let headers = new Headers();
        let postData = {
            premisesId: info.branchPremises.premisesId,
            branchId: info.branchId
        };
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchNetworkFeasibility?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .flatMap((book: any) => {
                return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchBranchAssetFormList?branchId=' + info.branchId + '&alf_ticket=' + this.ticket, postData, {
                    headers: headers
                })
                    .map((res: any) => {
                        let assets = res.json();
                        book.assets = assets;
                        return book;
                    });
            });
    }

    updateAssestsProjection(postData: any) {

        let headers = new Headers();

        console.log(postData);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateBranchAssetFormList', postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    addApplicationInstallation(action, postData: any) {

        let headers = new Headers();
        let sendpostdata = {};

        if (action == 'Insert') {

            return this._http.post(environment.api_base_url_new + 'BranchCreation/addApplicationInstallation?applicationInstalled=' + postData.applicationInstalled + '&branchId=' + postData.branchId + '&createdBy=' + postData.createdBy, sendpostdata, {
                headers: headers
            })
                .timeout(environment.set_timeout_sec)
                .map((response: Response) => response.json())
                .catch(this._errorHandler);

        } else {

            return this._http.post(environment.api_base_url_new + 'BranchCreation/updateApplicationInstallation?applicationInstalledId=' + postData.applicationInstalltionId + '&applicationInstalled=' + postData.applicationInstalled + '&branchId=' + postData.branchId + '&updatedBy=' + postData.createdBy, sendpostdata, {
                headers: headers
            })
                .timeout(environment.set_timeout_sec)
                .map((response: Response) => response.json())
                .catch(this._errorHandler);

        }
    }

    fetchApplicationInstallation(branchId) {

        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchApplicationInstallation?branchId=' + branchId + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }


    updateBranchReadyDetails(info) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateBranchReadyDetails?alf_ticket=' + this.ticket + '&branchId=' + info.branchId + '&isBranchReady=Yes&updatedBy=' + info.updatedBy, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    updateOwnerAccountInfo(postData) {
        let headers = new Headers();
        let form = new FormData();
        form.append('accountNoWithIFSC', postData.accountNoWithIFSC);
        form.append('panCardNo', postData.panCardNo);
        form.append('loiId', postData.loiId);

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateOwnerAccountInfo?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }



    isPremisesLayoutCodePresent(values) {

        let headers = new Headers();
        let form = new FormData();
        form.append('layoutCode', values);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/isPremisesLayoutCodePresent?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    allowedToAddPremises(values) {

        let headers = new Headers();
        let form = new FormData();
        form.append('branchId', values);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/allowedToaddPremises?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    allowedToAddPremisesLayout(values) {

        let headers = new Headers();
        let form = new FormData();
        form.append('branchId', values);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/allowedToAddPremisesLayout?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }


    fetchPremisesQuestionList() {

        let headers = new Headers();
        let form = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchPremisesQuestionList?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    fetchStateList() {

        let headers = new Headers();
        let form = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchStateList?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    fetchBranchAssetFormList(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchBranchAssetFormList?branchId=' + branchId + '&alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateBranchAssetFormList(branchId) {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateBranchAssetFormList?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    fetchValidatePrerequisteItemList() {
        let headers = new Headers();
        let postData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/fetchValidatePrerequisteItemList?alf_ticket=' + this.ticket, postData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    updateBranchReadyForWorking(info) {

        let headers = new Headers();

        let sendPostData = {};

        return this._http.post(environment.api_base_url_new + 'BranchCreation/updateBranchReadyForWorking?alf_ticket=' + this.ticket + '&branchId=' + info.branchId + '&updatedBy=' + info.updatedBy, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

    }

    isLOIAccepted(branchId) {

        let headers = new Headers();
        let sendPostData = {};
        return this._http.post(environment.api_base_url_new + 'BranchCreation/isLOIAccepted/' + branchId + '?alf_ticket=' + this.ticket, sendPostData, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    addBulkBranch(values) {
        let headers = new Headers();
        let form = new FormData();
        form.append('uploadingFiles', values.uploadingFiles);
        form.append('documents', values.previnputDocuments);
        form.append('createdBy', values.createdBy);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/addBulkBranch?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getAllBranch() {
        let headers = new Headers();
        let form = new FormData();
        form.append('branchmasterId', '');
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/fetchApprovedBranchMasterRecords?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    getAllRole() {
        let headers = new Headers();
        let form = new FormData();
        return this._http.post(environment.api_base_url_new + 'BranchCreation/userController/getAllRole?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }

    performBranchApprovalAction(values) {
        let headers = new Headers();
        let form = new FormData();
        form.append('action', values.action);
        form.append('userID', values.userID);
        form.append('comment', values.comment);
        form.append('branchMasterModId', values.branchMasterModId);
        form.append('alf_ticket', values.alf_ticket);
        return this._http.post(environment.api_base_url_new + 'BranchCreation/inventoryController/performBranchApprovalAction?alf_ticket=' + this.ticket, form, {
            headers: headers
        })
            .timeout(environment.set_timeout_sec)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
    }



}
