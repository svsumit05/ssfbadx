import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { SmsTempService } from '../../services/sms-temp.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-temp-list',
  templateUrl: './dept-temp-list.component.html',
  styleUrls: ['./dept-temp-list.component.css']
})
export class DeptTempListComponent implements OnInit, AfterViewInit {

  private currentUser: User = new User();
  userInformation;
  responceData;
  fileData;
  templateList = [];
  errorMsg;
  showtemplate = false;
  tempDetails = {
    templateId: '',
    templateName: '',
    templateTypeId: 0,
    departmentId: 0,
    notificationType: '',
    frequency: '',
    processingType: '',
    textType: '',
    sourceSystemId: 0,
    isActive: 1,
    messageText: '',
    scheduledDate: null,
    scheduledtime: null,
    templateType: {
      templateTypeid: 0,
      templateTypeName: '',
      isActive: 0
    },
    department: {
      departmentId: 0,
      departmentName: '',
      isActive: 0
    },
    sourceSystem: {
      sourceSystemid: 0,
      sourceSystemName: ''
    },
    dynamicList: null,
    conditionalParameterList: null,
    createdBy: null,
    createdOn: null,
    approvedBy: null,
    approvedOn: null,
    userRole: 1,
    status: null,
    userList: [],
    startDate: null,
    endDate: null,
    responseEmailId: null,
    adhocType: null
  };

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private smsService: SmsTempService, private zone: NgZone, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit(): void {

    let userId = this.currentUser.userId;
    this.smsService.getUserInformation(userId).subscribe(resdata => this.userInformation = resdata, reserror => this.errorMsg = reserror, () => { });

    this.smsService.fetchTemplateByUser(userId).subscribe(resdata => this.templateList = resdata, reserror => this.errorMsg = reserror, () => { });

  }


  onSubmit(value) {

    let sendPostData = {
      templateId: this.tempDetails.templateId,
      uploadedBy: this.currentUser.userId,
      adhockType: this.tempDetails.adhocType,
      scheduledDate: this._utilService.convertToDate(value.scheduledDate)
    };

    if (this.tempDetails.adhocType != 'FileUpload') {
      this.fileData = null;
    }

    this.smsService.uploadAdhockTemplate(sendPostData, this.fileData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

      if (this.responceData.status == '200') {
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.showtemplate = false;
        this.router.navigate(['/template-list']);
      }
    });

  }

  getTemplateDetails(event) {

    let templateId = event.target.value;

    this.smsService.fetchTemplateById(templateId).subscribe(resdata => this.tempDetails = resdata[0], reserror => this.errorMsg = reserror, () => {
      this.showtemplate = true;
    });

  }

  onfileEvent(fileInput: any) {
    let file = fileInput.target.files[0];
    this.fileData = file;
  }


}
