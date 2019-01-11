import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {

        var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (value == 'NA' || value == '') {
            return '';
        }

        var d_date, d_month, d_year;

        if (args == 'dd MMM y') {

            // 09-16-2017

            d_date = value.substring(0, 2);
            d_month = value.substring(3, 5);
            d_year = value.substring(6, 10);

            d_month = (parseInt(d_month) - 1);


            var d = new Date(d_year, d_month, d_date);


            var month = month_names_short[d_month],
                day = d.getDate(),
                year = d.getFullYear();

            var date_string = day + ' ' + month + ' ' + year;


        } else if (args == 'MMM dd y') {

            // 09-16-2017

            d_month = value.substring(0, 2);
            d_date = value.substring(3, 5);
            d_year = value.substring(6, 10);

            d_month = (parseInt(d_month) - 1);


            var d = new Date(d_year, d_month, d_date);


            var month = month_names_short[d_month],
                day = d.getDate(),
                year = d.getFullYear();

            var date_string = day + ' ' + month + ' ' + year;


        } else {


            if (value.length == 8) {

                // 14-09-17

                d_date = value.substring(0, 2);
                d_month = value.substring(3, 5);
                d_year = value.substring(6, 8);
                d_year = '20' + d_year;
            }
            else {
                // 13/09/2017

                d_date = value.substring(0, 2);
                d_month = value.substring(3, 5);
                d_year = value.substring(6, 10);

            }

            d_month = (parseInt(d_month) - 1);


            var d = new Date(d_year, d_month, d_date);


            var month = month_names_short[d_month],
                day = d.getDate(),
                year = d.getFullYear();

            var date_string = day + ' ' + month + ' ' + year;


        }

        if (month == null) {
            return '';
        } else {
            return `${date_string}`;
        }


    }

}
