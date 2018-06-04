import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Match } from './match.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Match>;

@Injectable()
export class MatchService {

    private resourceUrl = SERVER_API_URL + 'api/matches';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/matches';
    private resourceRefreshUrl = SERVER_API_URL + 'api/matches/refresh';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(match: Match): Observable<EntityResponseType> {
        const copy = this.convert(match);
        return this.http.post<Match>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(match: Match): Observable<EntityResponseType> {
        const copy = this.convert(match);
        return this.http.put<Match>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Match>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Match[]>> {
        const options = createRequestOption(req);
        return this.http.get<Match[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Match[]>) => this.convertArrayResponse(res));
    }

    refresh(): Observable<EntityResponseType> {
        return this.http.put<any>(this.resourceRefreshUrl, { observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<HttpResponse<Match[]>> {
        const options = createRequestOption(req);
        return this.http.get<Match[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Match[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Match = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertArrayResponse(res: HttpResponse<Match[]>): HttpResponse<Match[]> {
        const jsonResponse: Match[] = res.body;
        const body: Match[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to Match.
     */
    private convertItemFromServer(match: Match): Match {
        const copy: Match = Object.assign({}, match);
        copy.date = this.dateUtils
            .convertDateTimeFromServer(match.date);
        return copy;
    }

    /**
     * Convert a Match to a JSON which can be sent to the server.
     */
    private convert(match: Match): Match {
        const copy: Match = Object.assign({}, match);

        copy.date = this.dateUtils.toDate(match.date);
        return copy;
    }
}
