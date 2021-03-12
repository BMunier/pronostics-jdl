import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Equipe } from './equipe.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Equipe>;

@Injectable()
export class EquipeService {

    private resourceUrl =  SERVER_API_URL + 'api/equipes';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/equipes';

    constructor(private http: HttpClient) { }

    create(equipe: Equipe): Observable<EntityResponseType> {
        const copy = this.convert(equipe);
        return this.http.post<Equipe>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(equipe: Equipe): Observable<EntityResponseType> {
        const copy = this.convert(equipe);
        return this.http.put<Equipe>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Equipe>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Equipe[]>> {
        const options = createRequestOption(req);
        return this.http.get<Equipe[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Equipe[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Equipe[]>> {
        const options = createRequestOption(req);
        return this.http.get<Equipe[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Equipe[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Equipe = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Equipe[]>): HttpResponse<Equipe[]> {
        const jsonResponse: Equipe[] = res.body;
        const body: Equipe[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Equipe.
     */
    private convertItemFromServer(equipe: Equipe): Equipe {
        const copy: Equipe = Object.assign({}, equipe);
        return copy;
    }

    /**
     * Convert a Equipe to a JSON which can be sent to the server.
     */
    private convert(equipe: Equipe): Equipe {
        const copy: Equipe = Object.assign({}, equipe);
        return copy;
    }
}
