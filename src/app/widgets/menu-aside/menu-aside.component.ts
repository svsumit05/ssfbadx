import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  private currentUrl: string;
  private currentUser: User = new User();
  public permissions = [];

  @Input() private links: Array<any> = [];
  constructor(private userServ: UserService, public router: Router) {
    // getting the current url
    this.router.events.subscribe((evt) => this.currentUrl = evt.url);
    this.userServ.currentUser.subscribe((user) => this.currentUser = user);
  }

  public ngOnInit() {

  }

  checkCanAccess(permissions) {
    let found = permissions.some(r => this.currentUser.permissions.indexOf(r) >= 0);
    return found;
   }

}
