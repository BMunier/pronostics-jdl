import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Tutu } from './tutu.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Tutu>;

@Injectable()
export class TutuService {

    private resourceUrl =  SERVER_API_URL + 'api/tutus';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/tutus';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(tutu: Tutu): Observable<EntityResponseType> {
        const copy = this.convert(tutu);
        return this.http.post<Tutu>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(tutu: Tutu): Observable<EntityResponseType> {
        const copy = this.convert(tutu);
        return this.http.put<Tutu>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Tutu>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Tutu[]>> {
        const options = createRequestOption(req);
        return this.http.get<Tutu[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Tutu[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Tutu[]>> {
        const options = createRequestOption(req);
        return this.http.get<Tutu[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Tutu[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Tutu = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Tutu[]>): HttpResponse<Tutu[]> {
        const jsonResponse: Tutu[] = res.body;
        const body: Tutu[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Tutu.
     */
    private convertItemFromServer(tutu: Tutu): Tutu {
        const copy: Tutu = Object.assign({}, tutu);
        copy.date = this.dateUtils
            .convertDateTimeFromServer(tutu.date);
        return copy;
    }

    /**
     * Convert a Tutu to a JSON which can be sent to the server.
     */
    private convert(tutu: Tutu): Tutu {
        const copy: Tutu = Object.assign({}, tutu);

        copy.date = this.dateUtils.toDate(tutu.date);
        return copy;
    }
}
