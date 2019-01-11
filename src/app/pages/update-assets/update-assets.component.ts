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
    selector: 'app-update-assets',
    templateUrl: './update-assets.component.html',
    styleUrls: ['./update-assets.component.css']
})
export class UpdateAssetsComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any;
    private currentUser: User = new User();


    branchParams = {
        branchState: '',
        branchDistrict: '',
        branchLocation: '',
        branchCity: '',
        branchType: '',
        strength: '',
        inputFiles: '',
        branchCode: '',
        ifscCode: '',
        micrCode: '',
        bsrCode: '',
        licenseNo: '',
        isDocumentUploaded: '',
        branchId: '',
        status: '',
        rbiDocuments: '',
        approxArea: '',
        typeOfBusiness: '',
        headPersonCount: '',
        employeeCount: '',
        budget: '',
        period: '',
        expBranchOpenDate: '',
        properties_details: [],
    };

    networkFeasibility = {
        isNetworkProcessInitiated: '',
        isNetworkFeasible: ''
    };

    assetsList: any = [];
    branchAssetFormMasterId = '';
    viewMode = 'SAVE';

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('updateAssetsProjection') updateAssetsProjection: Popup;


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
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                    self.viewAssestsProjectionPopup(data);
                });

                return row;

            }

        };
    }

    viewAssestsProjectionPopup(info: any) {

        this.branchParams = {
            branchState: info.branchState,
            branchDistrict: info.branchDistrict,
            branchCity: info.branchCity,
            branchLocation: info.branchLocation,
            branchType: info.branchType,
            strength: info.strength,
            inputFiles: info.inputFiles,
            branchCode: info.branchCode,
            ifscCode: info.ifscCode,
            micrCode: info.micrCode,
            bsrCode: info.bsrCode,
            licenseNo: info.licenseNo,
            isDocumentUploaded: info.isDocumentUploaded,
            branchId: info.branchId,
            status: info.status,
            rbiDocuments: info.rbiDocuments,
            approxArea: info.approxArea,
            typeOfBusiness: info.typeOfBusiness,
            headPersonCount: info.headPersonCount,
            employeeCount: info.employeeCount,
            budget: info.budget,
            period: info.period,
            expBranchOpenDate: info.expBranchOpenDate,
            properties_details: [],
        };

        this.updateAssetsProjection.options = {
            color: '#363794',
            header: 'Assets Projection Details',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchServ.fetchBranchAssetFormList(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.branchAssetFormMasterId !== undefined) {
                this.branchAssetFormMasterId = this.responceData.branchAssetFormMasterId;
                this.viewMode = this.responceData.saveStatus;
                this.assetsList = this.responceData.branchAssetFormList;
                this.updateMakerChecker();
                this.updateAssetsProjection.show(this.updateAssetsProjection.options);
            }else {
                this.toastr.pop('warning', 'Warning', 'Assests not added.');
            }
        });

    }

    updateMakerChecker() {

        let i = 0;
        for (let assets of this.assetsList) {
            this.assetsList[i].updatedBy = this.currentUser.userId;
            i++;
        }
    }

    saveAssetsDetails(type) {

        let assetsList = {
            branchAssetFormMasterId: this.branchAssetFormMasterId,
            saveStatus: type,
            branchAssetFormList: this.assetsList,
            createdBy: this.currentUser.userId,
            branchId: this.branchParams.branchId
        };

        console.log(assetsList);

        this.branchServ.updateAssestsProjection(assetsList).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Updaed Successfully.');
            this.updateAssetsProjection.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.ngVarReset();
            this.rerender();
        });

    }

    closeAssetsPopup() {
        this.ngVarReset();
        this.updateAssetsProjection.hide();
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
    }

    resetInstallation(i) {
        if (this.viewMode == 'SAVE') {
             this.assetsList[i].isInstallationDone = 'NO';
        }
    }

}
