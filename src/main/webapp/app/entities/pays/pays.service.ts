import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IPays } from 'app/shared/model/pays.model';

type EntityResponseType = HttpResponse<IPays>;
type EntityArrayResponseType = HttpResponse<IPays[]>;

@Injectable({ providedIn: 'root' })
export class PaysService {
  public resourceUrl = SERVER_API_URL + 'api/pays';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/pays';

  constructor(protected http: HttpClient) {}

  create(pays: IPays): Observable<EntityResponseType> {
    return this.http.post<IPays>(this.resourceUrl, pays, { observe: 'response' });
  }

  update(pays: IPays): Observable<EntityResponseType> {
    return this.http.put<IPays>(this.resourceUrl, pays, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPays>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPays[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPays[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
