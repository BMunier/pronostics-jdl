import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Pays } from './pays.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Pays>;

@Injectable()
export class PaysService {

    private resourceUrl =  SERVER_API_URL + 'api/pays';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/pays';

    constructor(private http: HttpClient) { }

    create(pays: Pays): Observable<EntityResponseType> {
        const copy = this.convert(pays);
        return this.http.post<Pays>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(pays: Pays): Observable<EntityResponseType> {
        const copy = this.convert(pays);
        return this.http.put<Pays>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Pays>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Pays[]>> {
        const options = createRequestOption(req);
        return this.http.get<Pays[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Pays[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Pays[]>> {
        const options = createRequestOption(req);
        return this.http.get<Pays[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Pays[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Pays = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Pays[]>): HttpResponse<Pays[]> {
        const jsonResponse: Pays[] = res.body;
        const body: Pays[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Pays.
     */
    private convertItemFromServer(pays: Pays): Pays {
        const copy: Pays = Object.assign({}, pays);
        return copy;
    }

    /**
     * Convert a Pays to a JSON which can be sent to the server.
     */
    private convert(pays: Pays): Pays {
        const copy: Pays = Object.assign({}, pays);
        return copy;
    }
}
