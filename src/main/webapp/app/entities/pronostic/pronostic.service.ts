import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Pronostic } from './pronostic.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Pronostic>;

@Injectable()
export class PronosticService {

    private resourceUrl =  SERVER_API_URL + 'api/pronostics';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/pronostics';

    constructor(private http: HttpClient) { }

    create(pronostic: Pronostic): Observable<EntityResponseType> {
        const copy = this.convert(pronostic);
        return this.http.post<Pronostic>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(pronostic: Pronostic): Observable<EntityResponseType> {
        const copy = this.convert(pronostic);
        return this.http.put<Pronostic>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Pronostic>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Pronostic[]>> {
        const options = createRequestOption(req);
        return this.http.get<Pronostic[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Pronostic[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Pronostic[]>> {
        const options = createRequestOption(req);
        return this.http.get<Pronostic[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Pronostic[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Pronostic = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Pronostic[]>): HttpResponse<Pronostic[]> {
        const jsonResponse: Pronostic[] = res.body;
        const body: Pronostic[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Pronostic.
     */
    private convertItemFromServer(pronostic: Pronostic): Pronostic {
        const copy: Pronostic = Object.assign({}, pronostic);
        return copy;
    }

    /**
     * Convert a Pronostic to a JSON which can be sent to the server.
     */
    private convert(pronostic: Pronostic): Pronostic {
        const copy: Pronostic = Object.assign({}, pronostic);
        return copy;
    }
}
