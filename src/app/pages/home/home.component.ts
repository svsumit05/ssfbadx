import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { UserMatrixService } from '../../services/user-matrix.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../../services/user.service';


@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

    public date: Date = new Date();

    private currentUser: User = new User();

    responceData: any;
    predefineMatrixForUser: any;
    errorMsg: any;
    ApplicationNameList = [];
    ApplicationRoleList = [];
    ApplicationNameValue: any = [];
    userApplRoleMatrixChildList = [];
    ApplicationRoleValue: any = [];
    userFileBean: any;
    isDefaultMatrixChanged = '';
    submitUserAppButton = false;

    constructor(private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService, private userMatrixService: UserMatrixService) {

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


        this.userMatrixService.fetchAllApplicationList().subscribe(resdata => this.responceData = resdata, () => { }, () => {
            this.responceData.forEach(element => {
                let appRole = {
                    applicationId: element.applicationId,
                    applicationName: element.applicationName,
                    applicationRoleList: element.applicationRoleList
                };
                this.ApplicationNameList.push(appRole);
            });


            this.userMatrixService.fetchPredefineMatrixForUser(this.currentUser.userId).subscribe(resdata => this.predefineMatrixForUser = resdata, reserror => this.errorMsg = reserror, () => {

                if (this.predefineMatrixForUser.userApplRoleMatrixChildList != undefined && this.predefineMatrixForUser.userApplRoleMatrixChildList.length > 0) {
                    this.userApplRoleMatrixChildList = this.predefineMatrixForUser.userApplRoleMatrixChildList;
                }


                this.userApplRoleMatrixChildList.forEach(element => {
                    if (element.isCreateOrUpdateAPIExecutedSuccesfully == 0) {
                        element.isCreateOrUpdateAPIExecutedSuccesfully = 'PENDING';
                    } else {
                        element.isCreateOrUpdateAPIExecutedSuccesfully = 'CREATED';
                    }
                });

                this.userApplRoleMatrixChildList.forEach(element => {
                    this.getApplicationRole(element.application.applicationId);
                });

                this.userFileBean = this.predefineMatrixForUser.userFileBean;
                if (this.userFileBean != undefined) {
                    this.isDefaultMatrixChanged = this.userFileBean.isDefaultMatrixChanged;
                }
            });


        });

    }

    getApplicationRole(feildCount) {
        this.ApplicationNameList.forEach(element => {
            if (element.applicationId == feildCount) {
                this.ApplicationRoleList.push(element.applicationRoleList);
            }
        });
    }

    public ngOnInit() {


    }

    public ngOnDestroy() {

    }

    submitUserApplicationRoleMapping() {

        let predefineApplRoleMatrixChildListArray = [];
        let isDefaultMatrixChanged = 0;

        let i = 0;

        this.predefineMatrixForUser.userApplRoleMatrixChildList.forEach(element => {
            let obj1 = {
                application: { applicationId: element.application.applicationId, applicationName: element.application.applicationName }
            };

            let applicationRoleId = 0;
            let applicationRoleName = '';


            if (this.ApplicationRoleValue[i] != undefined && this.ApplicationRoleValue[i] != element.applicationRole.applicationRoleId) {
                isDefaultMatrixChanged = 1;
            }


            if (this.ApplicationRoleValue[i] != undefined) {
                applicationRoleId = this.ApplicationRoleValue[i];
            } else {
                applicationRoleId = element.applicationRole.applicationRoleId;
            }

            if (this.ApplicationRoleList[i] !== undefined) {

                this.ApplicationRoleList[i].forEach(element => {
                    if (element.applicationRoleId == applicationRoleId) {
                        applicationRoleName = element.applicationRoleName;
                    }
                });

            } else {
                applicationRoleName = '';
            }

            let obj2 = {
                applicationRole: { applicationRoleId: applicationRoleId, applicationRoleName: applicationRoleName }
            };

            let obj3 = {
                predefineMatrixApplicationRole: { applicationRoleId: element.applicationRole.applicationRoleId, applicationRoleName: element.applicationRole.applicationRoleName }
            };

            let ObjData = Object.assign(obj1, obj2, obj3);

            i++;

            predefineApplRoleMatrixChildListArray.push(ObjData);
        });


        let post = {
            isDefaultMatrixChanged: isDefaultMatrixChanged,
            preDeAppRoleMatId: this.predefineMatrixForUser.preDeAppRoleMatId,
            userApplRoleMatrixChildList: predefineApplRoleMatrixChildListArray,
            userFileBean: {
                employeeId: this.currentUser.userId
            }
        };

        this.submitUserAppButton = true;
        this.userMatrixService.insertUserApplicationRoleMapping(post).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status == '200') {
                this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
            } else {
                this.submitUserAppButton = false;
                this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
            }
        });

    }

}
