import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IStade } from 'app/shared/model/stade.model';

type EntityResponseType = HttpResponse<IStade>;
type EntityArrayResponseType = HttpResponse<IStade[]>;

@Injectable({ providedIn: 'root' })
export class StadeService {
  public resourceUrl = SERVER_API_URL + 'api/stades';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/stades';

  constructor(protected http: HttpClient) {}

  create(stade: IStade): Observable<EntityResponseType> {
    return this.http.post<IStade>(this.resourceUrl, stade, { observe: 'response' });
  }

  update(stade: IStade): Observable<EntityResponseType> {
    return this.http.put<IStade>(this.resourceUrl, stade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStade[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
