import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { BranchService } from '../../services/branch.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Printd } from 'printd';


@Component({
    selector: 'app-loi',
    templateUrl: './loi.component.html',
    styleUrls: ['./loi.component.css']
})
export class LoiComponent implements implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    apiResponse: any;
    branchPremises = '';

    private currentUser: User = new User();

    imgfirstURL: string;
    imgsecoundURL: string;

    isReadonly = false;

    branchParams = {
        lovId: '',
        branchId: '',
        premisesId: '',
        areaOfPremises: '',
        monthlyRental: '',
        securityDeposite: '',
        periodOfLease: '',
        dateOfAggrement: '',
        rentalStartDate: '',
        escalationOfRent: '',
        paymentOfRent: '',
        isApplicableTaxPaid: '',
        electricityBill: '',
        maintananceCharge: '',
        noteryCharge: '',
        lockInPeriod: '',
        terminationNotice: '',
        isWhiteWashingDone: '',
        isParkingAvailable: '',
        electricityMeter: '',
        brokerage: '',
        loiGeneratedDate: '',
        ownerName: '',
        ownerAddress: '',
        ownerBankAccNo: '',
        ownerIFSCNO: '',
        ownerPanCardNo: '',
        premisesAddress: '',
        isLoiAcceptedByOwner: '',
        isLSRCleared: '',
        comments: '',
        nocDocuments: [],
        nocDocumentsString: '',
        isLicenseaggRegistered: '',
        regDocuments: [],
        regDocumentsString: '',
        isPossesionToSSFBL: '',
        saveStatus: '',
        proposedBranchName: ''
    };



    config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null,
        autoReset: 3000
    };

    constructor(private route: ActivatedRoute, private _userServ: UserService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private toastr: ToasterService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('viewLoiPopUp') viewLoiPopUp: Popup;
    @ViewChild('updateLoiPopUp') updateLoiPopUp: Popup;

    ngOnInit(): void {
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url_new + 'BranchCreation/getAllBranch' + '?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {},
                dataSrc: function (json) {
                    var return_array = [];
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
                title: 'Exp. Branch Opening Date',
                data: 'expBranchOpenDate'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-print\' aria-hidden=\'true\'></i> Generate/Print LOI</a>';
                    return row_title;
                }
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    let row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-pencil-square-o\' aria-hidden=\'true\'></i> View/Update LOI</a>';
                    return row_title;
                }
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)


                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.generateLoiPopUp(data);
                });

                $('td:nth-child(8)', row).unbind('click');
                $('td:nth-child(8)', row).bind('click', () => {
                    self.updateLoiPopUpOpen(data);
                });

                return row;

            }

        };
    }

    generateLoiPopUp(info: any) {

        this.viewLoiPopUp.options = {
            color: '#363794',
            header: 'Generate LOI',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        if (info.branchPremises == null) {
            this.toastr.pop('warning', 'In Progress', 'Apporved Premises details not found.');
            return true;
        }

        this.branchServ.fetchBranchPremises(info.branchId).subscribe(resdata => this.apiResponse = resdata, reserror => this.errorMsg = reserror, () => {
            let isNetworkFeasible = '';
            for (let item of this.apiResponse) {
                if (item.mdAction == 'Approve') {
                    if (item.networkFeasibilty != null) {
                        isNetworkFeasible = item.networkFeasibilty.isNetworkFeasible;
                    } else {
                        isNetworkFeasible = 'No';
                        this.toastr.pop('warning', 'In Progress', 'Network feasibilty details not found.');
                    }
                }
            }
            if (isNetworkFeasible == 'YES') {

                this.branchServ.fetchLoi(info.branchId).subscribe(resdata => this.apiResponse = resdata, reserror => this.errorMsg = reserror, () => {

                    this.branchParams = {
                        lovId: this.apiResponse.lovId,
                        branchId: this.apiResponse.branchId,
                        premisesId: this.apiResponse.premisesId,
                        areaOfPremises: this.apiResponse.areaOfPremises,
                        monthlyRental: this.apiResponse.monthlyRental,
                        securityDeposite: this.apiResponse.securityDeposite,
                        periodOfLease: this.apiResponse.periodOfLease,
                        dateOfAggrement: this.apiResponse.dateOfAggrement,
                        rentalStartDate: this.apiResponse.rentalStartDate,
                        escalationOfRent: this.apiResponse.escalationOfRent,
                        paymentOfRent: this.apiResponse.paymentOfRent,
                        isApplicableTaxPaid: this.apiResponse.isApplicableTaxPaid,
                        electricityBill: this.apiResponse.electricityBill,
                        maintananceCharge: this.apiResponse.maintananceCharge,
                        noteryCharge: this.apiResponse.noteryCharge,
                        lockInPeriod: this.apiResponse.lockInPeriod,
                        terminationNotice: this.apiResponse.terminationNotice,
                        isWhiteWashingDone: this.apiResponse.isWhiteWashingDone,
                        isParkingAvailable: this.apiResponse.isParkingAvailable,
                        electricityMeter: this.apiResponse.electricityMeter,
                        brokerage: this.apiResponse.brokerage,
                        loiGeneratedDate: this.apiResponse.loiGeneratedDate,
                        ownerName: this.apiResponse.ownerName,
                        ownerAddress: this.apiResponse.ownerAddress,
                        ownerBankAccNo: this.apiResponse.ownerBankAccountNo,
                        ownerIFSCNO: this.apiResponse.ifscCode,
                        ownerPanCardNo: this.apiResponse.ownerPanCardNo,
                        premisesAddress: this.apiResponse.addressLine1 + ' ' + this.apiResponse.addressLine2 + ' ' + this.apiResponse.addressLine3 + ' ' + this.apiResponse.city + ' ' + this.apiResponse.state + ' ' + this.apiResponse.pincode,
                        isLoiAcceptedByOwner: this.apiResponse.isLoiAcceptedByOwner,
                        isLSRCleared: this.apiResponse.isLSRCleared,
                        comments: this.apiResponse.comments,
                        nocDocuments: [],
                        nocDocumentsString: '',
                        isLicenseaggRegistered: this.apiResponse.isLicenseaggRegistered,
                        regDocuments: [],
                        regDocumentsString: '',
                        isPossesionToSSFBL: this.apiResponse.isPossesionToSSFBL,
                        saveStatus: '',
                        proposedBranchName: info.proposedBranchName
                    };

                    // this.branchPremises = this.apiResponse.branchPremises.propertyName;

                    this.viewLoiPopUp.show(this.viewLoiPopUp.options);
                });
            }
        });

    }

    generateLoi() {

        this.viewLoiPopUp.hide();

        const cssText = `
        .text-left {
            text-align: left!important;
         }
        .text-center {
            text-align: center!important;
         }
         input {
            border: none;
            background: transparent;
         }
        .table {
            width: 100%;
            max-width: 100%;
         }
         table.table {
             border: 1px solid #000;
         }
         table.table > thead > tr > td {
            border: 1px solid #000;
         }
            table.table > tbody > tr > td {
            border: 1px solid #000;
         }`;
        const d: Printd = new Printd();
        d.print(document.getElementById('print-loi-section'), cssText);


    }

    cancelGenerateLoi() {
        this.viewLoiPopUp.hide();
    }

    updateLoiPopUpOpen(info: any) {

        if (info.branchPremises == null) {
            this.toastr.pop('warning', 'In Progress', 'Apporved Premises details not found.');
            return true;
        }


        this.branchServ.fetchLoi(info.branchId).subscribe(resdata => this.apiResponse = resdata, reserror => this.errorMsg = reserror, () => { });

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.updateLoiPopUp.options = {
            color: '#363794',
            header: 'Updtae LOI',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchParams.branchId = info.branchId;

        this.branchServ.fetchBranchPremises(info.branchId).subscribe(resdata => this.apiResponse = resdata, reserror => this.errorMsg = reserror, () => {
            let isNetworkFeasible = '';
            for (let item of this.apiResponse) {
                if (item.mdAction == 'Approve') {
                    if (item.networkFeasibilty != null) {
                        isNetworkFeasible = item.networkFeasibilty.isNetworkFeasible;
                    } else {
                        isNetworkFeasible = 'No';
                        this.toastr.pop('warning', 'In Progress', 'Network feasibilty details not found.');
                    }
                }
            }
            if (isNetworkFeasible == 'YES') {
                this.branchServ.fetchLoiAddtionaDetails(info.branchId).subscribe(resdata => this.apiResponse = resdata, reserror => this.errorMsg = reserror, () => {

                    this.branchParams = {
                        lovId: this.apiResponse.lovId,
                        branchId: this.apiResponse.branchId,
                        premisesId: this.apiResponse.premisesId,
                        areaOfPremises: this.apiResponse.areaOfPremises,
                        monthlyRental: this.apiResponse.monthlyRental,
                        securityDeposite: this.apiResponse.securityDeposite,
                        periodOfLease: this.apiResponse.periodOfLease,
                        dateOfAggrement: this.apiResponse.dateOfAggrement,
                        rentalStartDate: this.apiResponse.rentalStartDate,
                        escalationOfRent: this.apiResponse.escalationOfRent,
                        paymentOfRent: this.apiResponse.paymentOfRent,
                        isApplicableTaxPaid: this.apiResponse.isApplicableTaxPaid,
                        electricityBill: this.apiResponse.electricityBill,
                        maintananceCharge: this.apiResponse.maintananceCharge,
                        noteryCharge: this.apiResponse.noteryCharge,
                        lockInPeriod: this.apiResponse.lockInPeriod,
                        terminationNotice: this.apiResponse.terminationNotice,
                        isWhiteWashingDone: this.apiResponse.isWhiteWashingDone,
                        isParkingAvailable: this.apiResponse.isParkingAvailable,
                        electricityMeter: this.apiResponse.electricityMeter,
                        brokerage: this.apiResponse.brokerage,
                        loiGeneratedDate: this.apiResponse.loiGeneratedDate,
                        ownerName: this.apiResponse.ownerName,
                        ownerAddress: this.apiResponse.ownerAddress,
                        ownerBankAccNo: this.apiResponse.ownerBankAccNo,
                        ownerIFSCNO: this.apiResponse.ownerIFSCNO,
                        ownerPanCardNo: this.apiResponse.ownerPanCardNo,
                        premisesAddress: this.apiResponse.addressLine1 + ' ' + this.apiResponse.addressLine2 + ' ' + this.apiResponse.addressLine3 + ' ' + this.apiResponse.city + ' ' + this.apiResponse.state + ' ' + this.apiResponse.pincode,
                        isLoiAcceptedByOwner: this.apiResponse.isLoiAcceptedByOwner,
                        isLSRCleared: this.apiResponse.isLSRCleared,
                        comments: this.apiResponse.comments,
                        nocDocuments: [],
                        nocDocumentsString: this.apiResponse.nocDocuments,
                        isLicenseaggRegistered: this.apiResponse.isLicenseaggRegistered,
                        regDocuments: [],
                        regDocumentsString: this.apiResponse.regDocuments,
                        isPossesionToSSFBL: this.apiResponse.isPossesionToSSFBL,
                        saveStatus: '',
                        proposedBranchName: info.proposedBranchName
                    };

                    if (this.apiResponse.saveStatus == 'null' || this.apiResponse.saveStatus == 'SUBMIT') {
                        this.isReadonly = true;
                    }

                    this.updateLoiPopUp.show(this.updateLoiPopUp.options);

                });
            }
        });

    }

    updateLoi(value: any, type) {

        if (type == 'SUBMIT' && this.branchParams.regDocumentsString == '') {
            this.toastr.pop('warning', 'Warning', 'Kindly Upload required document to proceed.');
            return true;
        }

        value.saveStatus = type;

        console.log(value);
        debugger;

        this.branchServ.updateLoi(value, this.branchParams).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Updated Successfully.');
            this.updateLoiPopUp.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.rerender();
        });

    }


    updateLoiPopUpClose() {
        this.updateLoiPopUp.hide();
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

    onUploadError(ev) {

    }

    onUploadSuccessinputFiles(ev: any, img_type: string) {
        const image_uuid = JSON.parse(ev[1]);

        if (img_type == 'regDocuments') {
            this.branchParams.regDocuments.push(image_uuid.data[0]);

            const approvalDocId = [];
            this.branchParams.regDocumentsString !== '';

            if (this.branchParams.regDocuments.length > 0) {

                for (const value of this.branchParams.regDocuments) {
                    approvalDocId.push(Object.values(value));
                }

                this.branchParams.regDocumentsString = approvalDocId.join();
            }

        }

        if (img_type == 'nocDocuments') {
            this.branchParams.nocDocuments.push(image_uuid.data[0]);

            const dimensionPhotoId = [];
            this.branchParams.nocDocumentsString !== '';

            if (this.branchParams.nocDocuments.length > 0) {

                for (const value of this.branchParams.nocDocuments) {
                    dimensionPhotoId.push(Object.values(value));
                }

                this.branchParams.nocDocumentsString = dimensionPhotoId.join();
            }
        }

    }

}
