import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
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
    selector: 'app-add-branch-details',
    templateUrl: './add-branch-details.component.html',
    styleUrls: ['./add-branch-details.component.css']
})
export class AddBranchDetailsComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    showDatePicker = false;
    private currentUser: User = new User();

    branchParams = {
        branchState: '',
        branchDistrict: '',
        branchCity: '',
        branchLocation: '',
        branchType: '',
        branchClassification: '',
        branchCode: '',
        ifscCode: '',
        micrCode: '',
        bsrCode: '',
        licenseNo: '',
        approxArea: '',
        typeOfBusiness: '',
        headPersonCount: '',
        employeeCount: '',
        budget: '',
        period: '',
        branchId: '',
        userId: '',
        expBranchOpenDate: '',
        branchPremisesCount: 0,
        strength: 0,
        proposedBranchName: '',
        nearestLocation: ''
    };

    expBranchOpenDate = new Date();

    @ViewChild('addBranchDetails') addBranchDetails: Popup;

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private zone: NgZone) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

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

                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            }
        };
    }

    someClickHandler(info: any): void {

        this.branchParams = {
            branchState: info.branchState || '',
            branchDistrict: info.branchDistrict || '',
            branchCity: info.branchCity || '',
            branchLocation: info.branchLocation || '',
            branchType: info.branchType || '',
            branchClassification: info.branchClassification || '',
            branchCode: info.branchCode || '',
            ifscCode: info.ifscCode || '',
            micrCode: info.micrCode || '',
            bsrCode: info.bsrCode || '',
            licenseNo: info.licenseNo || '',
            approxArea: info.approxArea || '',
            typeOfBusiness: info.typeOfBusiness || '',
            headPersonCount: info.headPersonCount || '',
            employeeCount: info.employeeCount || '',
            budget: info.budget || '',
            period: info.period || '',
            branchId: info.branchId || '',
            userId: this.currentUser.userId || '',
            expBranchOpenDate: info.expBranchOpenDate || '',
            branchPremisesCount: info.branchPremisesCount || '',
            strength: info.strength || 0,
            proposedBranchName: info.proposedBranchName || '',
            nearestLocation: info.nearestLocation || ''
        };

        this._utilService.convertdmyToymd(info.expBranchOpenDate);
        this.addBranchDetailsPopup();
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


    addBranchDetailsPopup() {

        this.addBranchDetails.options = {
            color: '#363794',
            header: 'Add branch details',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.addBranchDetails.show(this.addBranchDetails.options);

        setTimeout(() => {
            this.showDatePicker = true;
        }, 2000);

    }

    updateBranchDetails(value: any) {

        this.branchParams.approxArea = value.approxArea;
        this.branchParams.typeOfBusiness = value.typeOfBusiness;
        this.branchParams.headPersonCount = value.headPersonCount;
        this.branchParams.employeeCount = value.employeeCount;
        this.branchParams.budget = value.budget;
        this.branchParams.period = value.period;
        this.branchParams.strength = value.strength;
        this.branchParams.expBranchOpenDate = this._utilService.formateDateCommon(this.expBranchOpenDate);
        this.branchParams.proposedBranchName = value.proposedBranchName;
        this.branchParams.nearestLocation = value.nearestLocation;

        let postData = {
            approxArea: value.approxArea,
            typeOfBusiness: value.typeOfBusiness,
            headPersonCount: value.headPersonCount,
            employeeCount: value.employeeCount,
            budget: value.budget,
            period: value.period,
            strength: value.strength,
            expBranchOpenDate: this.branchParams.expBranchOpenDate,
            branchId: this.branchParams.branchId,
            userId: this.branchParams.userId,
            proposedBranchName: this.branchParams.proposedBranchName,
            nearestLocation: this.branchParams.nearestLocation
        };

        this.branchServ.addBranchAddDetails(postData).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Branch Details Successfully.');
            this.addBranchDetails.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.rerender();
            this.resetFromData();
        });
    }

    cancelUpdateBranch() {
        this.resetFromData();
        this.addBranchDetails.hide();
    }

    resetFromData() {

        this.showDatePicker = false;

        this.expBranchOpenDate = new Date();

        this.branchParams = {
            branchState: '',
            branchDistrict: '',
            branchCity: '',
            branchLocation: '',
            branchType: '',
            branchClassification: '',
            branchCode: '',
            ifscCode: '',
            micrCode: '',
            bsrCode: '',
            licenseNo: '',
            approxArea: '',
            typeOfBusiness: '',
            headPersonCount: '',
            employeeCount: '',
            budget: '',
            period: '',
            branchId: '',
            userId: '',
            expBranchOpenDate: '',
            branchPremisesCount: 0,
            strength: 0,
            proposedBranchName: ''
        };
    }


}
