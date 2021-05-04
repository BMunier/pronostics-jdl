import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEquipe, Equipe } from 'app/shared/model/equipe.model';
import { EquipeService } from './equipe.service';
import { EquipeComponent } from './equipe.component';
import { EquipeDetailComponent } from './equipe-detail.component';
import { EquipeUpdateComponent } from './equipe-update.component';

@Injectable({ providedIn: 'root' })
export class EquipeResolve implements Resolve<IEquipe> {
  constructor(private service: EquipeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEquipe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((equipe: HttpResponse<Equipe>) => {
          if (equipe.body) {
            return of(equipe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Equipe());
  }
}

export const equipeRoute: Routes = [
  {
    path: '',
    component: EquipeComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.equipe.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EquipeDetailComponent,
    resolve: {
      equipe: EquipeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.equipe.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EquipeUpdateComponent,
    resolve: {
      equipe: EquipeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.equipe.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EquipeUpdateComponent,
    resolve: {
      equipe: EquipeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'pronosticsApp.equipe.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
