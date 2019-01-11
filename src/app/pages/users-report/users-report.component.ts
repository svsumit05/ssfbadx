import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { UserMatrixService } from '../../services/user-matrix.service';

@Component({
    selector: 'app-users-report',
    templateUrl: './users-report.component.html',
    styleUrls: ['./users-report.component.css']
})
export class UsersReportComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    recordTypeDropDown: any;
    errorMsg: any;
    responceData: any;


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOptsArray = [];

    fromDate = new Date();
    toDate = new Date();
    reportType = '';

    private currentUser: User = new User();

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private _userMatrixService: UserMatrixService) {

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


    }


    ngOnInit(): void {
    }



    downloadFile() {

        let dataString = {
            startDate: this._utilService.formateDateYYMMDD(this.fromDate),
            endDate: this._utilService.formateDateYYMMDD(this.toDate),
            reportType: this.reportType
        };


        this._userMatrixService.downloadUserReport(dataString);


    }

}
