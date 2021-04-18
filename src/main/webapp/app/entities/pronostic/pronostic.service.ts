import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IPronostic } from 'app/shared/model/pronostic.model';

type EntityResponseType = HttpResponse<IPronostic>;
type EntityArrayResponseType = HttpResponse<IPronostic[]>;

@Injectable({ providedIn: 'root' })
export class PronosticService {
  public resourceUrl = SERVER_API_URL + 'api/pronostics';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/pronostics';

  constructor(protected http: HttpClient) {}

  create(pronostic: IPronostic): Observable<EntityResponseType> {
    return this.http.post<IPronostic>(this.resourceUrl, pronostic, { observe: 'response' });
  }

  update(pronostic: IPronostic): Observable<EntityResponseType> {
    return this.http.put<IPronostic>(this.resourceUrl, pronostic, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPronostic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPronostic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPronostic[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
