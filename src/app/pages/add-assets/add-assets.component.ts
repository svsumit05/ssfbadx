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
    selector: 'app-add-assets',
    templateUrl: './add-assets.component.html',
    styleUrls: ['./add-assets.component.css']
})
export class AddAssetsComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();
    assetsList: any;
    updateAssetsList: any;
    errorMsg: any;
    responceData: any;
    assetsData: any;
    private currentUser: User = new User();

    addAssetsForm = {
        projectedQuantity: '',
        createdBy: '',
        branchAsset: {
            branchAssetsid: ''
        },
        branchId: ''
    };

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


        this.branchServ.getAssetList().subscribe(resdata => this.assetsList = resdata, reserror => this.errorMsg = reserror, () => {
            console.log(this.assetsList);
        });

    }



    @ViewChild('addBranchAssetsPopup') addBranchAssetsPopup: Popup;
    @ViewChild('editBranchAssetsPopup') editBranchAssetsPopup: Popup;
    @ViewChild('viewAssetsPopup') viewAssetsPopup: Popup;

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
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    const row_title = '<a href=\'javascript:void(0);\'><i class=\'fa fa-plus-circle\' aria-hidden=\'true\'></i> Add Assets </a>';
                    return row_title;
                }
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)

                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                    self.assetsDetails(data);
                });

                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.updateBranchAssets(data);
                });

                return row;

            }

        };
    }


    updateBranchAssets(info: any) {

        this.addBranchAssetsPopup.options = {
            color: '#363794',
            header: 'Update Branch Assests',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.editBranchAssetsPopup.options = {
            color: '#363794',
            header: 'Update Branch Assests',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.addAssetsForm.branchId = info.branchId;

        this.branchServ.fetchLoiAddtionaDetails(info.branchId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.saveStatus !== undefined && this.responceData.saveStatus == 'SUBMIT') {

                this.branchServ.fetchBranchAssetFormList(info.branchId).subscribe(resdata => this.updateAssetsList = resdata.branchAssetFormList, reserror => this.errorMsg = reserror, () => {

                    if (this.updateAssetsList !== undefined && this.updateAssetsList.length > 0) {

                        if (this._userServ.canCurrentUser('IT_INFRA_TEAM')) {
                            this.toastr.pop('warning', 'Warning', 'Assets Already Added modification not allowed');
                            return true;
                        }

                        this.editBranchAssetsPopup.show(this.editBranchAssetsPopup.options);
                    }else {
                        this.addBranchAssetsPopup.show(this.addBranchAssetsPopup.options);
                    }

                });

            } else {
                this.toastr.pop('warning', 'Warning', 'LOI Approval Pending');
            }

        });

    }

    assetsDetails(info: any) {


        this.viewAssetsPopup.options = {
            color: '#363794',
            header: 'View Branch Assests',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchServ.fetchBranchAssetFormList(info.branchId).subscribe(resdata => this.assetsData = resdata.branchAssetFormList, reserror => this.errorMsg = reserror, () => {
            this.viewAssetsPopup.show(this.viewAssetsPopup.options);

        });



    }

    saveAssetSepc(value: any) {

        console.log(value);

        let postData = [];

        for (let assetsData in this.assetsList) {
            console.log(assetsData);

            let addAssets = {
                branchAsset: {
                    branchAssetsid: this.assetsList[assetsData].branchAssetsid
                },
                branchId: this.addAssetsForm.branchId,
                projectedQuantity: eval('value.asset_' + this.assetsList[assetsData].branchAssetsid),
                createdBy: this.currentUser.userId
            }
            postData.push(addAssets);
        }
        
        debugger;
        
        this.branchServ.addBranchAssetsForm(postData, this.addAssetsForm.branchId, this.currentUser.userId).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Added Successfully.');
        }, reserror => this.errorMsg = reserror, () => {
            this.addBranchAssetsPopup.hide();
            this.editBranchAssetsPopup.hide();
        });
    }

    closeAssetForm() {
        this.addBranchAssetsPopup.hide();
        this.editBranchAssetsPopup.hide();
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


    }
}
