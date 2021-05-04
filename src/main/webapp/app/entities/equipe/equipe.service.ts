import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IEquipe } from 'app/shared/model/equipe.model';

type EntityResponseType = HttpResponse<IEquipe>;
type EntityArrayResponseType = HttpResponse<IEquipe[]>;

@Injectable({ providedIn: 'root' })
export class EquipeService {
  public resourceUrl = SERVER_API_URL + 'api/equipes';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/equipes';

  constructor(protected http: HttpClient) {}

  create(equipe: IEquipe): Observable<EntityResponseType> {
    return this.http.post<IEquipe>(this.resourceUrl, equipe, { observe: 'response' });
  }

  update(equipe: IEquipe): Observable<EntityResponseType> {
    return this.http.put<IEquipe>(this.resourceUrl, equipe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEquipe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipe[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
