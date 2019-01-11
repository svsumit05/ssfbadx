import {AfterViewInit, Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Subject';
import {Router, ActivatedRoute} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {UserService} from '../../services/user.service';
import {BranchService} from '../../services/branch.service';
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-branch-report',
  templateUrl: './branch-report.component.html',
  styleUrls: ['./branch-report.component.css']
})
export class BranchReportComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    errorMsg: any;
    responceData: any = [];
    private currentUser: User = new User();

    constructor(private route: ActivatedRoute, private _userServ: UserService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService, private zone: NgZone) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    ngOnInit(): void {
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url_new + 'BranchCreation/getAllBranchReport?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: {},
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'Branch Code',
                data: 'branchCode',
                render: function (data, type, row) {
                    if (row.branchCode != null) {
                        return '<strong>' + row.branchCode +'</strong>';
                    }else {
                        return '<strong>------</strong>';
                    }
                }
            }, {
                title: 'Branch Type',
                data: 'branchType'
            }, {
                title: 'Branch State',
                data: 'branchState'
            }, {
                title: 'Branch City',
                data: 'branchCity'
            }, {
                title: 'Branch Location',
                data: 'branchLocation'
            }, {
                title: 'Exp. Branch Opening Date',
                data: 'expBranchOpenDate'
            }, {
                title: 'Penalty Date',
                data: 'penaltyDate'
            }, {
                title: 'Action By',
                data: 'latestActionPerformedBy'
            }, {
                title: 'Status',
                data: 'status'
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td:nth-child(1)', row).unbind('click');
                $('td:nth-child(1)', row).bind('click', () => {

                });
                return row;
            }
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

}
