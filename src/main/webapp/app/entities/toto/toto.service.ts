import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Toto } from './toto.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Toto>;

@Injectable()
export class TotoService {

    private resourceUrl =  SERVER_API_URL + 'api/totos';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/totos';

    constructor(private http: HttpClient) { }

    create(toto: Toto): Observable<EntityResponseType> {
        const copy = this.convert(toto);
        return this.http.post<Toto>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(toto: Toto): Observable<EntityResponseType> {
        const copy = this.convert(toto);
        return this.http.put<Toto>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Toto>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Toto[]>> {
        const options = createRequestOption(req);
        return this.http.get<Toto[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Toto[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Toto[]>> {
        const options = createRequestOption(req);
        return this.http.get<Toto[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Toto[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Toto = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Toto[]>): HttpResponse<Toto[]> {
        const jsonResponse: Toto[] = res.body;
        const body: Toto[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Toto.
     */
    private convertItemFromServer(toto: Toto): Toto {
        const copy: Toto = Object.assign({}, toto);
        return copy;
    }

    /**
     * Convert a Toto to a JSON which can be sent to the server.
     */
    private convert(toto: Toto): Toto {
        const copy: Toto = Object.assign({}, toto);
        return copy;
    }
}
