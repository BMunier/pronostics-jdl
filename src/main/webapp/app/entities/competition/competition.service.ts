import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Competition } from './competition.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Competition>;

@Injectable()
export class CompetitionService {

    private resourceUrl =  SERVER_API_URL + 'api/competitions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/competitions';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(competition: Competition): Observable<EntityResponseType> {
        const copy = this.convert(competition);
        return this.http.post<Competition>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(competition: Competition): Observable<EntityResponseType> {
        const copy = this.convert(competition);
        return this.http.put<Competition>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Competition>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Competition[]>> {
        const options = createRequestOption(req);
        return this.http.get<Competition[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Competition[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Competition[]>> {
        const options = createRequestOption(req);
        return this.http.get<Competition[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Competition[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Competition = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Competition[]>): HttpResponse<Competition[]> {
        const jsonResponse: Competition[] = res.body;
        const body: Competition[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Competition.
     */
    private convertItemFromServer(competition: Competition): Competition {
        const copy: Competition = Object.assign({}, competition);
        copy.dateDebut = this.dateUtils
            .convertDateTimeFromServer(competition.dateDebut);
        copy.dateFin = this.dateUtils
            .convertDateTimeFromServer(competition.dateFin);
        return copy;
    }

    /**
     * Convert a Competition to a JSON which can be sent to the server.
     */
    private convert(competition: Competition): Competition {
        const copy: Competition = Object.assign({}, competition);

        copy.dateDebut = this.dateUtils.toDate(competition.dateDebut);

        copy.dateFin = this.dateUtils.toDate(competition.dateFin);
        return copy;
    }
}
