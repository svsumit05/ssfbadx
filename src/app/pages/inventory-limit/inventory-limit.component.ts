import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { InventoryMasterService } from '../../services/inventory-master.service';
import { environment } from '../../../environments/environment';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service';

@Component({
    selector: 'app-inventory-limit',
    templateUrl: './inventory-limit.component.html',
    styleUrls: ['./inventory-limit.component.css']
})
export class InventoryLimitComponent implements OnInit {

    addInventoryData = {
        'id': '',
        'invName': '',
        'invId': '',
        'invLimit': '',
        'invBranch': ''
    };

    inventoryListDropDown: any;

    private currentUser: User = new User();

    errorMsg = '';
    dtOptions: DataTables.Settings = {};

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _invetservice: InventoryMasterService, private _orderInventService: OrderInventoryServiceService) {

        this._orderInventService.getInventoryList(this.currentUser.user_extra_info.product).subscribe(resdata => this.inventoryListDropDown = resdata.data, reserror => this.errorMsg = reserror, () => {
            this.addInventoryData.invId = this.inventoryListDropDown[1].id;
        });

    }

    @ViewChild('inventroyDetailViewPopup') inventroyDetailViewPopup: Popup;
    @ViewChild('inventroyAddPopup') inventroyAddPopup: Popup;

    someClickHandler(info: any): void {
        this.addInventoryData.id = info.id;
        this.addInventoryData.invName = info.inventory_name;
        this.addInventoryData.invId = info.invent_id;
        this.addInventoryData.invLimit = info.invent_th_limit;
        this.addInventoryData.invBranch = info.branch_id;
        this.getDetailRowInfo();
    }


    ngOnInit() {
        this.dtOptions = {
            ajax: {
                url: environment.frontend_api_base_url + 'inv_threshold/list',
                method: 'POST'
            },
            columns: [
                {
                    title: 'ID',
                    data: 'inventory_name'
                },
                {
                    title: 'Name',
                    data: 'inventory_name'
                }, {
                    title: 'invent_th_limit',
                    data: 'invent_th_limit'
                },
                {
                    title: 'Branch Id',
                    data: 'branch_id'
                }
            ],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            },

        };

    }


    updateInventroyLimitDetails() {

        const postData = {
            'id': this.addInventoryData.id,
            'invent_th_limit': this.addInventoryData.invLimit,
        };

        this._invetservice.updateInventroryLimit(postData).subscribe();
        this.inventroyDetailViewPopup.hide();
        document.getElementById('inventroyLimitDetailUpdate').reset();

    }

    addInventroyLimitDetails() {
        console.log(this.addInventoryData);

        const postData = {
            'invent_id': this.addInventoryData.invId,
            'branch_id': this.addInventoryData.invBranch,
            'invent_th_limit': this.addInventoryData.invLimit
        };

        this._invetservice.addInventroryLimit(postData).subscribe();
        this.inventroyAddPopup.hide();
        document.getElementById('inventroyLimitDetail').reset();
    }


    getDetailRowInfo() {
        this.inventroyDetailViewPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Update Inventory threshold limit',
            widthProsentage: 60,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.inventroyDetailViewPopup.show(this.inventroyDetailViewPopup.options);
    }

    addInventoryLimit() {

        this.inventroyAddPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Add Inventory threshold limit',
            widthProsentage: 60,
            animation: 'bounceInDown',
            confirmBtnContent: 'Submit'
        };
        this.inventroyAddPopup.show(this.inventroyAddPopup.options);

    }



}
