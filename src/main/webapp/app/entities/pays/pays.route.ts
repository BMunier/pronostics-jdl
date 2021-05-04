import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPays, Pays } from 'app/shared/model/pays.model';
import { PaysService } from './pays.service';
import { PaysComponent } from './pays.component';
import { PaysDetailComponent } from './pays-detail.component';
import { PaysUpdateComponent } from './pays-update.component';

@Injectable({ providedIn: 'root' })
export class PaysResolve implements Resolve<IPays> {
  constructor(private service: PaysService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPays> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((pays: HttpResponse<Pays>) => {
          if (pays.body) {
            return of(pays.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pays());
  }
}

export const paysRoute: Routes = [
  {
    path: '',
    component: PaysComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pays.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaysDetailComponent,
    resolve: {
      pays: PaysResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pays.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaysUpdateComponent,
    resolve: {
      pays: PaysResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pays.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaysUpdateComponent,
    resolve: {
      pays: PaysResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.pays.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
