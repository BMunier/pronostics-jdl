import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { ICompetition } from 'app/shared/model/competition.model';

type EntityResponseType = HttpResponse<ICompetition>;
type EntityArrayResponseType = HttpResponse<ICompetition[]>;

@Injectable({ providedIn: 'root' })
export class CompetitionService {
  public resourceUrl = SERVER_API_URL + 'api/competitions';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/competitions';

  constructor(protected http: HttpClient) {}

  create(competition: ICompetition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(competition);
    return this.http
      .post<ICompetition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(competition: ICompetition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(competition);
    return this.http
      .put<ICompetition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICompetition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICompetition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICompetition[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(competition: ICompetition): ICompetition {
    const copy: ICompetition = Object.assign({}, competition, {
      dateDebut: competition.dateDebut && competition.dateDebut.isValid() ? competition.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: competition.dateFin && competition.dateFin.isValid() ? competition.dateFin.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? moment(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? moment(res.body.dateFin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((competition: ICompetition) => {
        competition.dateDebut = competition.dateDebut ? moment(competition.dateDebut) : undefined;
        competition.dateFin = competition.dateFin ? moment(competition.dateFin) : undefined;
      });
    }
    return res;
  }
}
