import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {DeliverablesService} from '../../services/deliverables.service';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';

@Component({
    selector: 'app-delvi-dist',
    templateUrl: './delvi-dist.component.html',
    styleUrls: ['./delvi-dist.component.css']
})
export class DelviDistComponent implements OnInit {

    private currentUser: User = new User();
    deliverableType: any = '';
    api_responce_temp: any = [];
    api_responce_api_data: any = [];
    receivedAtCPUDate: any = '';
    frcDate: any = '';
    discardedDate: any = '';
    qtd: any[] = [];
    rtoData = {
        id: 0,
        rtoStep: 6,
        deliverableType: '',
        receivedAtCPU: '',
        receivedAtCPUDate: '',
        cpuAction: '',
        frcDate: '',
        discardedDate: '',
    };

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    constructor(private _userServ: UserService, private _utilService: UtilitiesHelper, private _deliverablesService: DeliverablesService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    ngOnInit() {

    }

    getDestructionList() {
        this.rtoData.deliverableType = this.deliverableType;
        this._deliverablesService.getDestructionlist(this.deliverableType).subscribe(resdata => this.api_responce_temp = resdata, () => {}, () => {
            this.api_responce_api_data = this.api_responce_temp.data;
        });
    }

    setdate1(ev) {
        this.receivedAtCPUDate = ev;
    }

    setdate2(ev, id) {
        this.frcDate = ev;
        this.submitDestructionData1(id);
    }

    setdate3(ev, id) {
        this.discardedDate = ev;
        this.submitDestructionData2(id);
    }


    submitDestructionData1(id) {
        this.rtoData.id = id;
        this.rtoData.rtoStep = 6;
        this.rtoData.receivedAtCPU = $('#receivedAtCPU_' + id).val();
        this.rtoData.cpuAction = $('#cpuAction_' + id).val();
        this.rtoData.receivedAtCPUDate = this.receivedAtCPUDate;
        this.rtoData.frcDate = this.frcDate;
        this.rtoData.discardedDate = this.discardedDate || '';

        console.log(this.rtoData.discardedDate);
        if (this.rtoData.frcDate != '' && this.rtoData.frcDate !== undefined) {

            let t = confirm('Do you want to save the changes ?');

            if (t == true) {
                this._deliverablesService.submitDestructionData(this.rtoData).subscribe(resdata => this.api_responce_temp = resdata, () => {}, () => {
                    this.receivedAtCPUDate = '';
                    this.frcDate = '';
                    this.discardedDate = '';
                    this.getDestructionList();
                });
            }

        }
    }

    submitDestructionData2(id) {

        this.rtoData.id = id;
        this.rtoData.rtoStep = 7;
        this.rtoData.receivedAtCPU = $('#receivedAtCPU_' + id).val();
        this.rtoData.cpuAction = $('#cpuAction_' + id).val();
        this.rtoData.receivedAtCPUDate = this.receivedAtCPUDate;
        this.rtoData.frcDate = this.frcDate || '';
        this.rtoData.discardedDate = this.discardedDate;


        if (this.rtoData.discardedDate != '' && this.rtoData.discardedDate !== undefined) {

            let t = confirm('Do you want to save the changes ?');

            if (t == true) {
                this._deliverablesService.submitDestructionData(this.rtoData).subscribe(resdata => this.api_responce_temp = resdata, () => {}, () => {
                    this.receivedAtCPUDate = '';
                    this.frcDate = '';
                    this.discardedDate = '';
                    this.getDestructionList();
                });
            }

        }
    }

    submitDestructionData3(ev) {
        this.rtoData.receivedAtCPUDate = ev;
    }

}
