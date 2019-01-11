import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {UserService} from './user.service';

@Injectable()
export class LocationsService {

    private ticket: string;


    constructor(private _http: Http, private user: UserService) {
        this.user.currentUser.subscribe((user) => {
            this.ticket = user.ticket;
        });
    }

    _errorHandler(error: Response) {
        console.error(error);
        window.location.reload();
        return Observable.throw(error || 'server error');
    }



    /*
     * Locations Location Masters API
     *
     */

     getStatesList() {
        var headers = new Headers();
        var form = new FormData();
        return this._http.post(environment.frontend_api_base_url + 'location_states/list', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
     }

     getCityList() {
        var headers = new Headers();
        var form = new FormData();
        return this._http.post(environment.frontend_api_base_url + 'location_city/list', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
     }

     updateStates(postData: any) {

        var headers = new Headers();
        var form = new FormData();
        form.append('id', postData.id);
        form.append('name', postData.name);

        return this._http.post(environment.frontend_api_base_url + 'location_states/update', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    createStates(postData: any) {

        var headers = new Headers();
        var form = new FormData();
        form.append('name', postData.name);

        return this._http.post(environment.frontend_api_base_url + 'location_states/save', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    createCity(postData: any) {

        var headers = new Headers();
        var form = new FormData();
        form.append('city_name', postData.city_name);
        form.append('state_id', postData.state_id);

        return this._http.post(environment.frontend_api_base_url + 'location_city/save', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

    updateCity(postData: any) {

        var headers = new Headers();
        var form = new FormData();
        form.append('id', postData.id);
        form.append('city_name', postData.city_name);
        form.append('state_id', postData.state_id);

        return this._http.post(environment.frontend_api_base_url + 'location_city/update', form, {
            headers: headers
        })
        .timeout(environment.set_timeout_sec)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
    }

}
