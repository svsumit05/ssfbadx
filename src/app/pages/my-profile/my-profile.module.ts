import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { FormsModule } from '@angular/forms';
import { MyProfileComponent } from './my-profile.component';
import { ConfirmPasswordDirective } from '../../directives/confirm-password.directive';
import { MyProfileService } from '../../services/my-profile.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyProfileRoutingModule
  ],
  declarations: [MyProfileComponent, ConfirmPasswordDirective],
  providers : [MyProfileService]
})
export class MyProfileModule { }
