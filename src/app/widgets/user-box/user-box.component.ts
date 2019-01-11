import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  /* tslint:disable */
  selector: '.userBox',
  /* tslint:enable */
  styleUrls: ['./user-box.component.css'],
  templateUrl: './user-box.component.html'
})
export class UserBoxComponent implements OnInit {
  private currentUser: User = new User();

  constructor(private userServ: UserService, private router: Router) {
      // Connect to the current user's change
      this.userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  public ngOnInit() {
    // TODO
  }

  private logout = (): void => {

    this.userServ.deleteToken(this.currentUser.ticket).subscribe(() => {

    } , () => {

          this.router.navigate(['login']);

    }, () => {

          this.userServ.logout();

    });

  }
}
