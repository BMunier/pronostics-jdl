import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICompetition, Competition } from 'app/shared/model/competition.model';
import { CompetitionService } from './competition.service';
import { CompetitionComponent } from './competition.component';
import { CompetitionDetailComponent } from './competition-detail.component';
import { CompetitionUpdateComponent } from './competition-update.component';

@Injectable({ providedIn: 'root' })
export class CompetitionResolve implements Resolve<ICompetition> {
  constructor(private service: CompetitionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompetition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((competition: HttpResponse<Competition>) => {
          if (competition.body) {
            return of(competition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Competition());
  }
}

export const competitionRoute: Routes = [
  {
    path: '',
    component: CompetitionComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.competition.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompetitionDetailComponent,
    resolve: {
      competition: CompetitionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.competition.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompetitionUpdateComponent,
    resolve: {
      competition: CompetitionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.competition.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompetitionUpdateComponent,
    resolve: {
      competition: CompetitionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.competition.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
