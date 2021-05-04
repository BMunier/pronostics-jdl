import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_API_URL } from '../../app.constants';

import { About } from './about.model';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/shared/util/request-util';
import { map } from 'rxjs/operators';

export type AboutResponseType = HttpResponse<About>;
export type AboutArrayResponseType = HttpResponse<About[]>;

@Injectable()
export class AboutService {

    private resourceUrl = SERVER_API_URL + 'api/about/about';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/about/about';

    constructor(private http: HttpClient) { }

    search(req?: any): Observable<AboutResponseType> {
        const options = createRequestOption(req);
        return this.http.get<About>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: AboutResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: AboutResponseType): AboutResponseType {
        const body: About = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /* private convertArrayResponse(res: AboutArrayResponseType): AboutArrayResponseType {
        const jsonResponse: About[] = res.body;
        const body: About[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    } */

    /**
     * Convert a returned JSON object to About.
     */
    private convertItemFromServer(json: any): About {
        const copy: About = Object.assign(new About(), json);
        return copy;
    }

    /**
     * Convert a About to a JSON which can be sent to the server.
     */
    private convert(about: About): About {
        const copy: About = Object.assign({}, about);
        return copy;
    }
}
