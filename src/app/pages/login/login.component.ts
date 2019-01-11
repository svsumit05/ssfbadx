import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.css'], 
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    private username: string;
    private password = '';

    logindata = [];
    userdata = [];
    userInfo = [];
    errorMsg: string;
    user1: any;

    constructor(private _userServ: UserService, private router: Router, private toastr: ToasterService) { }

    public ngOnInit() {
        // window.dispatchEvent(new Event('resize'));
    }

    private login() {
        this._userServ.getLogin(this.username, this.password)
        .subscribe(resdata => this.logindata = resdata, reserror => { this.toastr.pop('error', 'Failed', 'Invalid User ID or Password'); }, () => this.saveLoginData());
    }


    setUserInfo(user1: any) {

        this._userServ.getUserInformation(this.logindata.data.ticket, this.userdata.userName)
        .subscribe(resdata => this.userInfo = resdata, reserror => this.errorMsg = reserror, () => {
            this.user1.userId = this.userdata.userName;
            this.user1.firstname = this.userdata.fname;
            this.user1.lastname = this.userdata.lname;
            this.user1.connected = true;
            this.user1.role = this.userdata.designation.trim();
            this.user1.branch = this.userdata.branch;
            this.user1.branch_id = this.userdata.branchId;
            this.user1.user_extra_info = this.userInfo;
            this.user1.permissions = this.setPermissions(this.userdata.permissions);
            this._userServ.setCurrentUser(this.user1);
            this.router.navigate(['dashboard']);
        });
    }

    setPermissions(permissions: any) {
        var create_permissions = [];

        if (permissions != null) {

            permissions = JSON.parse(permissions);

            for (let item of permissions) {

                if (item.checked) {
                    create_permissions.push(item.name);
                }
            }
        }
        create_permissions.push('CAN_ACCESS_MY_PROFILE_CHANGE_PASSWORD');

        return create_permissions;
    }

    saveLoginData() {

        if (this.logindata) {

            if (this.logindata.data.ticket != null) {

                this.toastr.pop('success', 'Welcome ' + this.username, 'You have logged in successfully');

                this.user1 = new User({
                    avatarUrl: 'public/assets/img/avatar.png',
                    email: '',
                    firstname: '',
                    lastname: ''
                });

                this.user1.connected = true;
                this.user1.ticket = this.logindata.data.ticket;

                this._userServ.getUserInfo(this.logindata.data.ticket).subscribe(resdata => this.userdata = resdata, reserror => this.errorMsg = reserror, () => this.setUserInfo(this.user1));

            } else {
                this.toastr.pop('error', 'Failed', 'Sorry, something went wrong: Please try again...');
            }


        } else {
            this.toastr.pop('error', 'Failed', 'Sorry, something went wrong: Please try again...');
        }
    }
}
