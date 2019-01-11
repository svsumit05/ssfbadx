import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()


export class UtilitiesHelper {

    constructor(private _http: Http) { }

    formatDate(date) {

        let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var d = new Date(date),
            month = '' + month_names_short[d.getMonth()],
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (day.length < 2) day = '0' + day;

        if (isNaN(day) && month == 'undefined') {
            var d = new Date(),
                month = '' + month_names_short[d.getMonth()],
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (day.length < 2) day = '0' + day;
        }

        return [day, month, year].join('-');
    }

    formateDateCommon(date) {

        let d = new Date(date);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();

        return [day, month, year].join('-');

    }

    formateDateYYMMDD(date) {
        let d = new Date(date);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();

        if (day.length < 2) { day = '0' + day; }
        if (month.length < 2) { month = '0' + month; }

        return [year, month, day].join('-');
    }

    convertdmyToymd(date) {
        let new_date = date.split('-');
        let month = (new_date[1] - 1);
        let day = new_date[0];
        let year = new_date[2];
        let d = new Date(year, month, day);
        return d;
    }

    convertToDate(date) {
        let dateString = date;
        if (dateString == '' || dateString == null) {
            return null;
        } else {
            dateString = dateString.split('-');
            let y = dateString[0];
            let m = dateString[1];
            let d = dateString[2];
            return d + '-' + m + '-' + y;
        }
    }

    convertToDateToString(date) {
        let dateString = date;
        if (dateString == '' || dateString == null) {
            return null;
        } else {
            dateString = dateString.split('-');
            let y = dateString[2];
            let m = dateString[1];
            let d = dateString[0];
            return y + '-' + m + '-' + d;
        }
    }

    formateDateMDY(date) {

        let d = new Date(date);
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();

        if (day <= 9) {
            day = '0' + day;
        }

        if (month <= 9) {
            month = '0' + month;
        }

        return [month, day, year].join('-');

    }

    getRandomNumber() {
        return new Date().getTime().toString();
    }

    getDaysThreshold(startDate, endDate) {
        return endDate.valueOf() == startDate.valueOf();
    }

    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }
}
