import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IStade, Stade } from 'app/shared/model/stade.model';
import { StadeService } from './stade.service';
import { StadeComponent } from './stade.component';
import { StadeDetailComponent } from './stade-detail.component';
import { StadeUpdateComponent } from './stade-update.component';

@Injectable({ providedIn: 'root' })
export class StadeResolve implements Resolve<IStade> {
  constructor(private service: StadeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStade> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((stade: HttpResponse<Stade>) => {
          if (stade.body) {
            return of(stade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Stade());
  }
}

export const stadeRoute: Routes = [
  {
    path: '',
    component: StadeComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.stade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StadeDetailComponent,
    resolve: {
      stade: StadeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.stade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StadeUpdateComponent,
    resolve: {
      stade: StadeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.stade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StadeUpdateComponent,
    resolve: {
      stade: StadeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.stade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
