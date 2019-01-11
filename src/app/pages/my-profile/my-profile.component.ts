import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {environment} from '../../../environments/environment';
import {MyProfileService} from '../../services/my-profile.service';
import {ConfirmPasswordDirective} from '../../directives/confirm-password.directive';
import {ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';



@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css'],
    directives: [ConfirmPasswordDirective]
})
export class MyProfileComponent implements OnInit {

    private currentUser: User = new User();
    errorMsg: any;

    constructor(private route: ActivatedRoute, private _userServ: UserService, private myprofileService: MyProfileService, private toastr: ToasterService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    };

    ngOnInit() {
    }

    onChangePassword(value: any) {

        this.myprofileService.changePassword(value).subscribe(
            () => {},
            () => {this.toastr.pop('error', 'Error', 'Something Went Wrong ! Please Try Again.'); },
            () => {this.toastr.pop('success', 'Successful', 'Password Updated successfully.'); });
    }


}
