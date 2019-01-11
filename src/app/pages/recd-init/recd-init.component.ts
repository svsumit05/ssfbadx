import { Component, OnInit } from '@angular/core';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { RecordmgmService } from '../../services/recordmgm.service';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-recd-init',
  templateUrl: './recd-init.component.html',
  styleUrls: ['./recd-init.component.css']
})
export class RecdInitComponent implements OnInit {


  errorMsg: any;
  responceData: any;
  branchDropDown: any;
  documentDropDown: any;
  recordTypeDropDown: any;

  fromDate = new Date();
  toDate = new Date();
  branch = '';
  recordTypeId = '';
  actionType = '';


  datepickerOpts = {
    autoclose: true,
    todayHighlight: true,
    format: 'd-mm-yyyy'
  };

  fileData: any;
  actionUPLOAD = true;
  actionUPDATE = true;
  actionDOWNLOAD = true;

  private currentUser: User = new User();

  constructor(private popup: Popup, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService, private _vendorservice: VendorsService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
      this._vendorservice.getDocumentList().subscribe(resdata => this.documentDropDown = resdata, () => { }, () => {
        this._vendorservice.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
      });
    });

  }


  ngOnInit() {
    this.branch = this.currentUser.user_extra_info.branch;
  }

  ordfileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    console.log(file);
    this.fileData = file;
  }

  recdSubmit(action) {
    if (action == 'UPLOAD' || action == 'UPDATE') {
      this.recdUpload();
    } else {
      this.recdDownload();
    }
  }


  recdUpload() {


    if (this.actionType == 'UPLOAD') {

      let postData = {
        uploadingFiles: this.fileData,
        uploadedBy: this.currentUser.userId,
        recordTypeId: this.recordTypeId,
        roleId: this.currentUser.user_extra_info.role.roleID,
        loggedInUserBranchCode: this.currentUser.user_extra_info.branch,
      };

      this._recordMag.bulkRecordUpload(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          this.resetData();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    } else if (this.actionType == 'UPDATE') {

      let postData = {
        uploadingFiles: this.fileData,
        uploadedBy: this.currentUser.userId,
        recordTypeId: this.recordTypeId,
        roleId: this.currentUser.user_extra_info.role.roleID,
        loggedInUserBranchCode: this.currentUser.user_extra_info.branch
      };

      this._recordMag.updateBulkRecord(postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        if (this.responceData.status == 200) {
          this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          this.resetData();
        } else {
          this.toastr.pop('error', 'Error', this.responceData.statusMessge);
        }
      });

    }


  }

  recdDownload() {

    let postData = {
      branchCode: this.branch,
      startDate: this._utilService.formateDateCommon(this.fromDate),
      endDate: this._utilService.formateDateCommon(this.toDate),
      recordTypeId: this.recordTypeId,
      roleId: this.currentUser.user_extra_info.role.roleID
    };

    this._recordMag.downloadRecordPendingForBranch(postData);

  }

  onChange() {

    if (this.currentUser.user_extra_info.role.roleID == 5 && this.recordTypeId == 4) {
      this.actionUPLOAD = false;
      this.actionUPDATE = true;
      this.actionDOWNLOAD = false;
    } else if (this.currentUser.user_extra_info.role.roleID == 5 && this.recordTypeId != 4) {
      this.actionUPLOAD = true;
      this.actionUPDATE = true;
      this.actionDOWNLOAD = false;
    }

    if (this.currentUser.user_extra_info.role.roleID == 3 && this.recordTypeId == 4) {
      this.actionUPLOAD = true;
      this.actionUPDATE = false;
      this.actionDOWNLOAD = false;
    } else if (this.currentUser.user_extra_info.role.roleID == 3 && this.recordTypeId != 4) {
      this.actionUPLOAD = false;
      this.actionUPDATE = true;
      this.actionDOWNLOAD = true;
    }


  }

  downloadSampleReport() {
    this._recordMag.downloadSampleReport(this.recordTypeId);
  }

  resetData() {
    this.fileData = '';
    this.recordTypeId = '';
    this.actionType = '';

    this.actionUPLOAD = true;
    this.actionUPDATE = true;
    this.actionDOWNLOAD = true;
  }

}
