import { AfterViewInit, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { BranchService } from '../../services/branch.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-add-branch',
    templateUrl: './add-branch.component.html',
    styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    displayMode: any = 'ADD';

    errorMsg: any;
    responceData: any;
    stateList = [];

    showDatePicker = false;

    private currentUser: User = new User();
    branchParams = {
        branch_State: '',
        branchDistrict: '',
        branch_City: '',
        branch_Location: '',
        branch_Type: '',
        branchClassification: '',
        rbiReferenceNo: '',
        inputFiles: [],
        previnputFiles: '',
        isDocumentUploaded: '',
        branchId: 0,
        branchPremisesCount: 0,
        branchCode: '',
        ifscCode: '',
        micrCode: '',
        bsrCode: '',
        license_no: '',
        penaltyDate: ''
    };

    uploadfileParams = {
        uploadingFiles: '',
        documents: [],
        previnputDocuments: '',
        createdBy: ''
    };

    imgfirstURL: string;
    imgsecoundURL: string;

    @ViewChild('addBranch') addBranch: Popup;
    @ViewChild('editBranch') editBranch: Popup;
    @ViewChild('uploadBranch') uploadBranch: Popup;

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private zone: NgZone) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    config: DropzoneConfigInterface = {
        paramName: 'inputFiles',
        addRemoveLinks: true,
        thumbnailWidth: null,
        thumbnailHeight: null,
        autoReset: 3000,
        acceptedFiles: 'image/* , application/pdf',
    };

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    penaltyDate = new Date();

    uploadBranchPopup() {

        this.uploadBranch.options = {
            color: '#363794',
            header: 'Update branch From File.',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.config.autoReset = 10000;

        // this.config.paramName = 'uploadingFiles';
        // this.config.url = environment.api_base_url_new + 'BranchCreation/addBulkBranch?alf_ticket=' + this.currentUser.ticket;

        this.uploadBranch.show(this.uploadBranch.options);

    }

    uploadBranchData() {
        this.uploadfileParams.createdBy = this.currentUser.userId;

        this.branchServ.addBulkBranch(this.uploadfileParams).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

            if (this.responceData.status == '200') {
                this.uploadBranch.hide();
                document.getElementById('uploadForm').reset();
                this.toastr.pop('success', 'Error', this.responceData.statusMessge);
                this.rerender();
            } else {
                this.toastr.pop('error', 'Error', this.responceData.statusMessge);
                this.uploadBranch.hide();
                document.getElementById('uploadForm').reset();
            }


        });

    }

    closeUploadBranch() {
        this.uploadBranch.hide();
    }

    downloadFile() {
        window.open(environment.api_base_url_new + 'BranchCreation/downloadBulkBranchTemplate?alf_ticket=' + this.currentUser.ticket, '_blank');
    }


    someClickHandler(info: any): void {

        this.showDatePicker = false;

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;

        this.branchParams = {
            branchDistrict: info.branchDistrict || '',
            branch_State: info.branchState || '',
            branch_City: info.branchCity || '',
            branch_Location: info.branchLocation || '',
            branch_Type: info.branchType || '',
            branchClassification: info.branchClassification || '',
            rbiReferenceNo: info.rbiReferenceNo || '',
            inputFiles: [],
            previnputFiles: info.inputFiles || '',
            isDocumentUploaded: info.isDocumentUploaded || '',
            branchId: info.branchId,
            branchPremisesCount: info.branchPremisesCount || '',
            branchCode: info.branchCode || '',
            ifscCode: info.ifscCode || '',
            micrCode: info.micrCode || '',
            bsrCode: info.bsrCode || '',
            license_no: info.licenseNo || '',
            penaltyDate: info.penaltyDate || '',
        };

        if (info.branchPremisesCount <= 0) {
            this.displayMode = 'EDIT';
        } else if (info.ifscCode == null && this._userServ.canCurrentUser('BRANCH_BANKING_TEAM')) {
            this.displayMode = 'EDIT_UPDATE';
        } else {
            this.displayMode = 'VIEW';
        }


        this.editBranch.options = {
            color: '#363794',
            header: 'Update branch',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.editBranch.show(this.editBranch.options);

        setTimeout(() => {
            this.showDatePicker = true;
        }, 1000);
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
            }, {
                title: 'Is branch ready ?',
                data: '',
                render: function (data, type, row) {

                    if (row.isBranchReadyForWorking == 'Yes') {
                        return '<input class=\'inside-datatable\' type=\'checkbox\' checked disabled>';
                    } else if (row.branchPremises == null || row.branchPremises.approvedPremisesLayout == null || row.ifscCode == null || row.status != 'Prerequisite Details Approved') {
                        return '<input class=\'inside-datatable\' type=\'checkbox\' disabled>';
                    } else {
                        return '<input class=\'inside-datatable\' type=\'checkbox\'>';
                    }
                }
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {
                    self.someClickHandler(data);
                });

                $('td:nth-child(7)', row).unbind('click');
                $('td:nth-child(7)', row).bind('click', () => {
                    self.branchReady(data);
                });
                return row;
            }
        };
    }

    branchReady(info: any) {
        if (info.isBranchReadyForWorking != 'Yes') {
            var r = confirm('Press Ok if branch is ready for operation!');
            if (r === true) {

                info.updatedBy = this.currentUser.userId;

                this.branchServ.updateBranchReadyForWorking(info).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
                    this.toastr.pop('success', 'Successful', 'Branch is ready for operation.');
                    this.rerender();
                });

            }

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

    addBranchPopup() {

        this.imgfirstURL = environment.api_base_url + 'alfresco/s/api/node/workspace/SpacesStore/';
        this.imgsecoundURL = '/content;cm%3Acontent?alf_ticket=' + this.currentUser.ticket;

        this.config.url = environment.api_base_url + 'alfresco/s/suryoday/disbursement/uploadDocuments?alf_ticket=' + this.currentUser.ticket;
        this.addBranch.options = {
            color: '#363794',
            header: 'Add branch',
            showButtons: false,
            widthProsentage: 100,
            animation: 'bounceInDown',
        };

        this.branchServ.fetchStateList().subscribe(resdata => this.stateList = resdata, reserror => this.errorMsg = reserror, () => {
            this.addBranch.show(this.addBranch.options);
        });


    }

    createBranch(value: any) {

        if (this.branchParams.previnputFiles == '') {
            this.toastr.pop('warning', 'Failed', 'Please Upload Required Document to proceed.');
            return false;
        }

        this.branchParams.branch_State = value.branch_State;
        this.branchParams.branchDistrict = value.branchDistrict;
        this.branchParams.branch_City = value.branch_City;
        this.branchParams.branch_Location = value.branch_Location;
        this.branchParams.branch_Type = value.branch_Type;
        this.branchParams.branchClassification = value.branchClassification,
            this.branchParams.rbiReferenceNo = value.rbiReferenceNo;
        this.branchParams.isDocumentUploaded = value.isDocumentUploaded;
        let userId = this.currentUser.userId;

        this.branchServ.createBranch(this.branchParams, userId).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Branch Created Successfully.');
            this.addBranch.hide();
            document.getElementById('addBranchForm').reset();
        }, reserror => this.errorMsg = reserror, () => {
            this.resetVarData();
            this.rerender();
        });
    }

    updateBranch(value: any) {

        let sendPostData = {};

        if (this.branchParams.branchPremisesCount <= 0) {

            sendPostData = {
                'branchState': this.branchParams.branch_State,
                'branchDistrict': this.branchParams.branchDistrict,
                'branchCity': this.branchParams.branch_City,
                'branchLocation': this.branchParams.branch_Location,
                'branchType': this.branchParams.branch_Type,
                'branchClassification': this.branchParams.branchClassification,
                'inputFiles': this.branchParams.previnputFiles,
                'rbiReferenceNo': this.branchParams.rbiReferenceNo,
                'isDocumentUploaded': this.branchParams.isDocumentUploaded,
                'branchId': this.branchParams.branchId,
                'isActive': 1
            };

        } else {

            this.branchParams.penaltyDate = this._utilService.formateDateCommon(this.penaltyDate);

            sendPostData = {
                'branchState': this.branchParams.branch_State,
                'branchDistrict': this.branchParams.branchDistrict,
                'branchCity': this.branchParams.branch_City,
                'branchLocation': this.branchParams.branch_Location,
                'branchType': this.branchParams.branch_Type,
                'branchClassification': this.branchParams.branchClassification,
                'inputFiles': this.branchParams.previnputFiles,
                'rbiReferenceNo': this.branchParams.rbiReferenceNo,
                'isDocumentUploaded': this.branchParams.isDocumentUploaded,
                'branchId': this.branchParams.branchId,
                'isActive': 1,
                'branchCode': this.branchParams.branchCode,
                'ifscCode': this.branchParams.ifscCode,
                'micrCode': this.branchParams.micrCode,
                'bsrCode': this.branchParams.bsrCode,
                'licenseNo': this.branchParams.license_no,
                'penaltyDate': this.branchParams.penaltyDate
            };

        }

        this.branchServ.updateBranch(sendPostData).subscribe(() => {
            this.toastr.pop('success', 'Successful', 'Branch Details Update Successfully.');
            this.editBranch.hide();
        }, reserror => this.errorMsg = reserror, () => {
            this.resetVarData();
            this.rerender();
        });

    }

    cancelCreateBranch() {
        this.addBranch.hide();
    }
    cancelEditBranch() {
        this.editBranch.hide();
    }

    onUploadSuccessinputFiles(ev: any, img_type: string) {
        let image_uuid = JSON.parse(ev[1]);

        if (img_type == 'document1') {
            this.branchParams.inputFiles.push(image_uuid.data[0]);

            var approvalDocId = [];

            this.branchParams.previnputFiles = '';

            if (this.branchParams.inputFiles.length > 0) {

                for (let value of this.branchParams.inputFiles) {
                    approvalDocId.push(Object.values(value));
                }

                this.branchParams.previnputFiles = approvalDocId.join();

            }
        }

        if (img_type == 'document2') {
            this.uploadfileParams.documents.push(image_uuid.data[0]);

            var previnputDocuments = [];

            this.uploadfileParams.previnputDocuments = '';

            if (this.uploadfileParams.documents.length > 0) {

                for (let value of this.uploadfileParams.documents) {
                    previnputDocuments.push(Object.values(value));
                }

                this.uploadfileParams.previnputDocuments = previnputDocuments.join();
            }
        }

    }

    onUploadError(ev) {

    }

    ordfileEvent(fileInput: any) {
        let file = fileInput.target.files[0];
        this.uploadfileParams.uploadingFiles = file;
    }

    resetVarData() {
        this.branchParams = {
            branch_State: '',
            branchDistrict: '',
            branch_City: '',
            branch_Location: '',
            branch_Type: '',
            branchClassification: '',
            rbiReferenceNo: '',
            inputFiles: [],
            previnputFiles: '',
            isDocumentUploaded: '',
            branchId: 0,
            branchPremisesCount: 0,
            branchCode: '',
            ifscCode: '',
            micrCode: '',
            bsrCode: '',
            license_no: '',
            penaltyDate: ''
        };
    }

}
