import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPronostic, Pronostic } from 'app/shared/model/pronostic.model';
import { PronosticService } from './pronostic.service';
import { PronosticComponent } from './pronostic.component';
import { PronosticDetailComponent } from './pronostic-detail.component';
import { PronosticUpdateComponent } from './pronostic-update.component';

@Injectable({ providedIn: 'root' })
export class PronosticResolve implements Resolve<IPronostic> {
  constructor(private service: PronosticService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPronostic> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((pronostic: HttpResponse<Pronostic>) => {
          if (pronostic.body) {
            return of(pronostic.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pronostic());
  }
}

export const pronosticRoute: Routes = [
  {
    path: '',
    component: PronosticComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pronostic.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PronosticDetailComponent,
    resolve: {
      pronostic: PronosticResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pronostic.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PronosticUpdateComponent,
    resolve: {
      pronostic: PronosticResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pronostic.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PronosticUpdateComponent,
    resolve: {
      pronostic: PronosticResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pronostic.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
