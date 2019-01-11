import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UserMatrixService } from '../../services/user-matrix.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlertModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
  providers: [UserMatrixService]
})
export class HomeModule { }
