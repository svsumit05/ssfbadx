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
import { VendorsService } from '../../services/vendors.service';
import { BranchService } from '../../services/branch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { InventoryMasterService } from '../../services/inventory-master.service';

@Component({
    selector: 'app-recordmgm-report',
    templateUrl: './recordmgm-report.component.html',
    styleUrls: ['./recordmgm-report.component.css']
})
export class RecordmgmReportComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    branchDropDown: any;
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
    branch = 'ALL';
    reportType = '';
    recordTypeId = '';

    private currentUser: User = new User();
    private _listingURL;
    private columns: any;
    private columnDefs: any;

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private vendorServ: VendorsService, private _invetservice: InventoryMasterService) {

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);


        this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
            this.vendorServ.fetchAllRecordTypes().subscribe(resdata => this.recordTypeDropDown = resdata, () => { }, () => { });
        });


    }


    ngOnInit(): void {
        this.branch = this.currentUser.user_extra_info.branch;
    }



    downloadFile() {

        let dataString = {
            startDate: this._utilService.formateDateCommon(this.fromDate),
            endDate: this._utilService.formateDateCommon(this.toDate),
            branchCode: this.branch,
            recordTypeId : this.recordTypeId
        };

        if (this.reportType == 'DOCRET') {
            this._invetservice.downloadBranchDocumentRetrivalReport(dataString);
        } else {
            this._invetservice.downloadBranchDocumentReport(dataString);
        }

    }

}
