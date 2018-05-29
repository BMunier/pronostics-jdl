import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { PronosticSaisie } from './pronostic-saisie.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PronosticSaisie>;

@Injectable()
export class PronosticSaisieService {

    private resourceUrl =  SERVER_API_URL + 'api/pronosticsSaisi';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/pronosticsSaisi';

    constructor(private http: HttpClient) { }

    create(pronostic: PronosticSaisie): Observable<EntityResponseType> {
        const copy = this.convert(pronostic);
        return this.http.post<PronosticSaisie>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(pronostic: PronosticSaisie): Observable<EntityResponseType> {
        const copy = this.convert(pronostic);
        return this.http.put<PronosticSaisie>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PronosticSaisie>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PronosticSaisie[]>> {
        const options = createRequestOption(req);
        return this.http.get<PronosticSaisie[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PronosticSaisie[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PronosticSaisie[]>> {
        console.log("Saisie : Appel search")
        const options = createRequestOption(req);
        return this.http.get<PronosticSaisie[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PronosticSaisie[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PronosticSaisie = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PronosticSaisie[]>): HttpResponse<PronosticSaisie[]> {
        const jsonResponse: PronosticSaisie[] = res.body;
        const body: PronosticSaisie[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Pronostic.
     */
    private convertItemFromServer(pronostic: PronosticSaisie): PronosticSaisie {
        const copy: PronosticSaisie = Object.assign({}, pronostic);
        return copy;
    }

    /**
     * Convert a Pronostic to a JSON which can be sent to the server.
     */
    private convert(pronostic: PronosticSaisie): PronosticSaisie {
        const copy: PronosticSaisie = Object.assign({}, pronostic);
        return copy;
    }
}
