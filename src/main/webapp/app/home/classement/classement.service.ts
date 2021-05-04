import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_API_URL } from '../../app.constants';

import { Classement } from './classement.model';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/shared/util/request-util';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Classement>;

@Injectable()
export class ClassementService {

    private resourceUrl = SERVER_API_URL + 'api/competitions/classement';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/competitions/classement';

    constructor(private http: HttpClient) { }


    query(req?: any): Observable<HttpResponse<Classement[]>> {
        const options = createRequestOption(req);
        return this.http.get<Classement[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: HttpResponse<Classement[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Classement = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Classement[]>): HttpResponse<Classement[]> {
        let jsonResponse: Classement[] = [];
        if(res.body){
          jsonResponse = res.body;
        }
        const body: Classement[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

        /**
     * Convert a returned JSON object to Pronostic.
     */
    private convertItemFromServer(pronostic: any): Classement {
        const copy: Classement = Object.assign({}, pronostic);
        return copy;
    }

    /**
     * Convert a Pronostic to a JSON which can be sent to the server.
     */
    private convert(pronostic: Classement): Classement {
        const copy: Classement = Object.assign({}, pronostic);
        return copy;
    }
}
