import { Component, OnInit } from '@angular/core';
import { UtilitiesHelper } from '../../services/utilities.service';
import { DeliverablesService } from '../../services/deliverables.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-deliverables-reports',
    templateUrl: './deliverables-reports.component.html',
    styleUrls: ['./deliverables-reports.component.css']
})
export class DeliverablesReportsComponent implements OnInit {

    reportData: any;
    reportCollatedData: any;
    disb_from_date = new Date();
    disb_to_date = new Date();
    disb_branch_name = 'All';
    datepickerToOpts: any = { format: 'd-mm-yyyy' };

    private currentUser: User = new User();

    fdr_production_data: any = {
        type: 'Production',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    fdr_courier_data: any = {
        type: 'Courier',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    fdr_rto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    fdr_branchrto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    chequebook_production_data: any = {
        type: 'Production',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    chequebook_courier_data: any = {
        type: 'Courier',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    chequebook_rto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    chequebook_branchrto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    debitcard_production_data: any = {
        type: 'Production',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    debitcard_courier_data: any = {
        type: 'Courier',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    debitcard_rto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    debitcard_branchrto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    welcomekit_production_data: any = {
        type: 'Production',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    welcomekit_courier_data: any = {
        type: 'Courier',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    welcomekit_rto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    welcomekit_branchrto_data: any = {
        type: 'RTO',
        t1: '0',
        t2: '0',
        t3: '0',
        tn: '0'
    };

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    fdr_collated_data: any = {
        ACdate: '0',
        dispatch: '0',
        deliver: '0',
        rtoCount: '0',
        inTransitData: '0',
        lostInTransit: '0',
        destructAtCPU: '0'
    };

    chequebook_collated_data: any = {
        ACdate: '0',
        dispatch: '0',
        deliver: '0',
        rtoCount: '0',
        inTransitData: '0',
        lostInTransit: '0',
        destructAtCPU: '0'
    };

    debitcard_collated_data: any = {
        ACdate: '0',
        dispatch: '0',
        deliver: '0',
        rtoCount: '0',
        inTransitData: '0',
        lostInTransit: '0',
        destructAtCPU: '0'
    };

    welcomekit_collated_data: any = {
        ACdate: '0',
        dispatch: '0',
        deliver: '0',
        rtoCount: '0',
        inTransitData: '0',
        lostInTransit: '0',
        destructAtCPU: '0'
    };
    branchList: any;
    private sub: any;
    reportType: any;


    constructor(private _utilService: UtilitiesHelper, private _deliverablesService: DeliverablesService, private router: Router, private route: ActivatedRoute, private _userServ: UserService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    ngOnInit() {

        this._deliverablesService.getBranch().subscribe(resdata => this.branchList = resdata, reserror => { }, () => {
            this.branchList = this.branchList.data;
        });

        // when calling routes change
        this.sub = this.route.params.subscribe((data) => {
            this.reportType = data['id'];
        });

        let userId = this.currentUser.userId;

        this._deliverablesService.getReport(userId).subscribe(resdata => this.reportData = resdata, reserror => { }, () => {
            this.reportData = this.reportData;

            this.fdr_production_data = this.reportData.data[0].FDR[0];
            this.fdr_courier_data = this.reportData.data[0].FDR[1];
            this.fdr_rto_data = this.reportData.data[0].FDR[2];
            this.fdr_branchrto_data = this.reportData.data[0].FDR[3];

            this.debitcard_production_data = this.reportData.data[0].DebitCard[0];
            this.debitcard_courier_data = this.reportData.data[0].DebitCard[1];
            this.debitcard_rto_data = this.reportData.data[0].DebitCard[2];
            this.debitcard_branchrto_data = this.reportData.data[0].DebitCard[3];

            this.welcomekit_production_data = this.reportData.data[0].WelcomeKit[0];
            this.welcomekit_courier_data = this.reportData.data[0].WelcomeKit[1];
            this.welcomekit_rto_data = this.reportData.data[0].WelcomeKit[2];
            this.welcomekit_branchrto_data = this.reportData.data[0].WelcomeKit[3];

            this.chequebook_production_data = this.reportData.data[0].ChequeBook[0];
            this.chequebook_courier_data = this.reportData.data[0].ChequeBook[1];
            this.chequebook_rto_data = this.reportData.data[0].ChequeBook[2];
            this.chequebook_branchrto_data = this.reportData.data[0].ChequeBook[3];

            // debugger;


        });


    }

    getColletedReport() {

        let postData = {
            'fromDate': this.disb_from_date,
            'toDate': this.disb_to_date,
            'branchName': this.disb_branch_name
        };

        this._deliverablesService.getCollatedReport(postData).subscribe(resdata => this.reportCollatedData = resdata, reserror => { alert('error'); }, () => {
            this.fdr_collated_data = this.reportCollatedData.data[0].FDR[0];
            this.welcomekit_collated_data = this.reportCollatedData.data[0].WelcomeKit[0];
            this.chequebook_collated_data = this.reportCollatedData.data[0].ChequeBook[0];
            this.debitcard_collated_data = this.reportCollatedData.data[0].DebitCard[0];

        });

    }

    downloadReport(dType: string, dStatus: string) {
        let postData = {
            'deliverableType': dType,
            'status': dStatus,
            'branchName': this.disb_branch_name,
            'fromDate': this.disb_from_date,
            'toDate': this.disb_to_date
        };

        this._deliverablesService.downloadReport(postData);

        return false;

    }

    downloadAgengReport(deliverableType: string, report: string, tat: string) {

        let postDataUrl = 'alfresco/s/suryoday/downloadDashboardReportData?deliverableType=' + deliverableType + '&tat=' + tat + '&report=' + report;

        this._deliverablesService.downloadAgengReport(postDataUrl);

        return false;
    }

    handleDateFromChange(dateFrom: Date) {
        // update the model
        this.disb_from_date = dateFrom;

        let toDate = new Date(dateFrom);
        toDate = new Date(new Date(toDate).setMonth(toDate.getMonth() + 3));
        // do not mutate the object or angular won't detect the changes
        this.disb_to_date = dateFrom;

        this.datepickerToOpts = {
            startDate: dateFrom,
            endDate: toDate,
            autoclose: true,
            todayHighlight: true,
            format: 'd-mm-yyyy'
        };
    }

}
