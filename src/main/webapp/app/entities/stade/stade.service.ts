import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Stade } from './stade.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Stade>;

@Injectable()
export class StadeService {

    private resourceUrl =  SERVER_API_URL + 'api/stades';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/stades';

    constructor(private http: HttpClient) { }

    create(stade: Stade): Observable<EntityResponseType> {
        const copy = this.convert(stade);
        return this.http.post<Stade>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(stade: Stade): Observable<EntityResponseType> {
        const copy = this.convert(stade);
        return this.http.put<Stade>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Stade>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Stade[]>> {
        const options = createRequestOption(req);
        return this.http.get<Stade[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Stade[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Stade[]>> {
        const options = createRequestOption(req);
        return this.http.get<Stade[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Stade[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Stade = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Stade[]>): HttpResponse<Stade[]> {
        const jsonResponse: Stade[] = res.body;
        const body: Stade[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Stade.
     */
    private convertItemFromServer(stade: Stade): Stade {
        const copy: Stade = Object.assign({}, stade);
        return copy;
    }

    /**
     * Convert a Stade to a JSON which can be sent to the server.
     */
    private convert(stade: Stade): Stade {
        const copy: Stade = Object.assign({}, stade);
        return copy;
    }
}
