import {AfterViewInit, Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Subject';
import {Router, ActivatedRoute} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {UserService} from "../../services/user.service";
import {BranchService} from '../../services/branch.service';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-branch-details',
    templateUrl: './branch-details.component.html',
    styleUrls: ['./branch-details.component.css']
})
export class BranchDetailsComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any = [];
    private currentUser: User = new User();

    branchParams = {
        branchType: '',
        branchState: '',
        branchLocation: '',
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
        branchCity: '',
        expBranchOpenDate: '',
        createdBy: '',
        applicationInstalled: '',
        applicationInstalltionId: ''
    };


    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private zone: NgZone) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('updateAssetsStatus') updateAssetsStatus: Popup;

    ngOnInit(): void {
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url_new + 'BranchCreation/getAllBranch?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {},
                dataSrc: function (json) {
                    var return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'Branch Code',
                data: 'branchCode',
                render: function (data, type, row) {
                    if(row.branchCode != null) {
                        return '<a href="javascript:void(0)"><strong>' + row.branchCode +'</strong><a>';
                    }else {
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
                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            }
        };
    }

    someClickHandler(info: any): void {

        this.branchParams = {
            branchType: info.branchType,
            branchState: info.branchState,
            branchLocation: info.branchLocation,
            branchCode: info.branchCode,
            ifscCode: info.ifscCode,
            micrCode: info.micrCode,
            bsrCode: info.bsrCode,
            licenseNo: info.licenseNo,
            approxArea: info.approxArea,
            typeOfBusiness: info.typeOfBusiness,
            headPersonCount: info.headPersonCount,
            employeeCount: info.employeeCount,
            budget: info.budget,
            period: info.period,
            branchId: info.branchId,
            branchCity: info.branchCity,
            expBranchOpenDate: info.expBranchOpenDate,
            createdBy: this.currentUser.userId,
            applicationInstalled: '',
            applicationInstalltionId: ''
        };

        this.updateAssetsStatus.options = {
            color: "#363794",
            header: "Update Assets installation Status",
            showButtons: false,
            widthProsentage: 100,
            animation: "bounceInDown",
        }

        this.branchServ.fetchApplicationInstallation(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.length > 0) {
                this.branchParams.applicationInstalled = this.responceData[0].isRequiredApplInstalled;
                this.branchParams.applicationInstalltionId = this.responceData[0].applicationInstalltionId;
            }
            this.updateAssetsStatus.show(this.updateAssetsStatus.options);
        });



    }

    saveAppStatus(value: any) {
        console.log(value);

        this.branchParams.applicationInstalled = value.applicationInstalled;

        if (this.branchParams.applicationInstalltionId == '') {

            this.branchServ.addApplicationInstallation('Insert',this.branchParams).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Application Installation Status Updtaed Successfully.');
                this.updateAssetsStatus.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.rerender();
            });


        } else {

            this.branchServ.addApplicationInstallation('Update',this.branchParams).subscribe(() => {
                this.toastr.pop('success', 'Successful', 'Application Installation Status Updtaed Successfully.');
                this.updateAssetsStatus.hide();
            }, reserror => this.errorMsg = reserror, () => {
                this.rerender();
            });

        }
    }

    closeAppStatus() {
        this.updateAssetsStatus.hide();
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

    resetData() {

    }

}
