import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { RecordmgmService } from '../../services/recordmgm.service';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { VendorsService } from '../../services/vendors.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';


@Component({
  selector: 'app-recd-query',
  templateUrl: './recd-query.component.html',
  styleUrls: ['./recd-query.component.css']
})
export class RecdQueryComponent implements OnInit {

  recordQuery = {
    documentType: '',
    referenceType: '',
    referenceValue: '',
    branchCode: '',
    date: '',
    recordTypeId: ''
  };

  postData = {
    documentRecordId: '',
    documentName: '',
    loggendInUserName: '',
    isPhysicalCopyRequired: ''
  };

  fromDate = new Date();
  showDatePicker = false;

  datepickerOpts = {
    autoclose: true,
    todayHighlight: true,
    format: 'd-mm-yyyy'
  };

  responceData: any;
  errorMsg: any;

  recordTypeId = '';

  branchDropDown: any;
  documentDropDown: any;
  recordTypeDropDown: any;
  api_responce_server = [];

  isPhysicalCopyRequired: any;

  private currentUser: User = new User();

  constructor(private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _recordMag: RecordmgmService, private branchServ: BranchService, private _vendorservice: VendorsService) {

    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
      this._vendorservice.getDocumentList().subscribe(resdata => this.documentDropDown = resdata, () => { }, () => {
        this._vendorservice.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
      });
    });

  }

  ngOnInit(): void {
    this.recordQuery.branchCode = this.currentUser.user_extra_info.branch;
  }


  fatchRecords() {

    this.recordQuery.date = this._utilService.formateDateCommon(this.fromDate);
    this.recordQuery.recordTypeId = this.recordTypeId;

    this._recordMag.queryRecord(this.recordQuery).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      this.api_responce_server = this.responceData;

      if (this.responceData.length > 0) {
        this.postData.documentRecordId = this.responceData[0].branchDocumentRecordID;
      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
      }
    });
  }


  ordfileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    this.postData.documentName = file;
  }

  sendRetrivalRecordForCSUApproval() {
    this.postData.loggendInUserName = this.currentUser.userId;

    if (this.postData.documentName != '') {
      this._recordMag.uploadDocument(this.postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

        debugger;
        let image_uuid = this.responceData.data[0];
        image_uuid = Object.values(image_uuid);
        // let image_uuid = JSON.parse(this.responceData);
        // image_uuid.data[0];
        image_uuid = image_uuid.join();
        debugger;

        // let documentID = this.postData.documentName.name;
        this.postData.documentName = image_uuid;
        this.postData.isPhysicalCopyRequired = this.isPhysicalCopyRequired;

        this._recordMag.sendRetrivalRecordForCSUApproval(this.postData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
          if (this.responceData.status == 200) {
            this.api_responce_server = [];
            this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
          } else {
            this.toastr.pop('error', 'Error', this.responceData.statusMessge);
          }
        });

      });
    } else {
      this.toastr.pop('warning', 'Warning', 'Please Uplaod document.');
    }



  }


  showFeild() {
    if (this.recordTypeId == '1' || this.recordTypeId == '2') {
      this.showDatePicker = true;
    } else {
      this.showDatePicker = false;
    }
  }


}
