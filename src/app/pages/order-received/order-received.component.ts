import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service'
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';


@Component({
    selector: 'app-order-received',
    templateUrl: './order-received.component.html',
    styleUrls: ['./order-received.component.css']
})
export class OrderReceivedComponent implements OnInit {

    errorMsg: any;
    responceData: any;
    private currentUser: User = new User();
    orderReceivedDetails = {
        inputFile: '',
        uploadedBy: ''
    };
    isValid = false;
    docType = '';

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper) {

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    }

    ngOnInit(): void {
    }

    ordfileEvent(fileInput: any) {
        let file = fileInput.target.files[0];
        this.orderReceivedDetails.inputFile = file;
        this.isValid = true;
    }

    vendorOrderConfirmEvent() {
        this.isValid = false;
        this.orderReceivedDetails.uploadedBy = this.currentUser.userId;

        if (this.docType == 'VENDORFILE') {

            this._orderInventService.updateVendorOrderReceived(this.orderReceivedDetails).subscribe(rs => this.responceData = rs, reserror => this.errorMsg = reserror, () => {
                if (this.responceData.status == '200') {
                    this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                    this.vendorOrderCancelEvent();
                } else {
                    this.toastr.pop('warning', 'warning', this.responceData.statusMessge);
                }
            });

        } else {

            this._orderInventService.updateInstaKitDispatchDetails(this.orderReceivedDetails).subscribe(rs => this.responceData = rs, reserror => this.errorMsg = reserror, () => {
                if (this.responceData.status == '200') {
                    this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                    this.vendorOrderCancelEvent();
                } else {
                    this.toastr.pop('warning', 'warning', this.responceData.statusMessge);
                }
            });

        }



    }

    downloadFile(fileFormate) {
        if (fileFormate == 'INSTAKIT') {
            window.open(environment.api_base_url_new + 'BranchCreation/inventoryController/downloadUploadDispatchDetailTemplate?fileType=INSTAKIT&alf_ticket=' + this.currentUser.ticket, '_blank');
        } else {
            window.open(environment.api_base_url_new + 'BranchCreation/inventoryController/downloadUploadDispatchDetailTemplate?fileType=INVENTORY&alf_ticket=' + this.currentUser.ticket, '_blank');
        }

    }

    vendorOrderCancelEvent() {
        this.orderReceivedDetails = {
            inputFile: '',
            uploadedBy: ''
        };
        this.isValid = false;
    }


}
