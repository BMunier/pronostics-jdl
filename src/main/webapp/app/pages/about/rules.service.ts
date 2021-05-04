import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_API_URL } from '../../app.constants';

import { Rules } from './rules.model';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/shared/util/request-util';
import { map } from 'rxjs/operators';

export type RulesResponseType = HttpResponse<Rules>;
export type RulesArrayResponseType = HttpResponse<Rules[]>;

@Injectable()
export class RulesService {

    private resourceUrl = SERVER_API_URL + 'api/about/rules';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/about/rules';

    constructor(private http: HttpClient) { }

    search(req?: any): Observable<RulesResponseType> {
        const options = createRequestOption(req);
        return this.http.get<Rules>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: RulesResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: RulesResponseType): RulesResponseType {
        const body: Rules = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /* private convertArrayResponse(res: RulesArrayResponseType): RulesArrayResponseType {
        const jsonResponse: Rules[] = res.body;
        const body: Rules[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    } */

    /**
     * Convert a returned JSON object to Rules.
     */
    private convertItemFromServer(json: any): Rules {
        const copy: Rules = Object.assign(new Rules(), json);
        return copy;
    }

    /**
     * Convert a Rules to a JSON which can be sent to the server.
     */
    private convert(rules: Rules): Rules {
        const copy: Rules = Object.assign({}, rules);
        return copy;
    }
}
