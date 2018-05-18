import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { TutuComponent } from './tutu.component';
import { TutuDetailComponent } from './tutu-detail.component';
import { TutuPopupComponent } from './tutu-dialog.component';
import { TutuDeletePopupComponent } from './tutu-delete-dialog.component';

export const tutuRoute: Routes = [
    {
        path: 'tutu',
        component: TutuComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.tutu.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'tutu/:id',
        component: TutuDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.tutu.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const tutuPopupRoute: Routes = [
    {
        path: 'tutu-new',
        component: TutuPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.tutu.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'tutu/:id/edit',
        component: TutuPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.tutu.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'tutu/:id/delete',
        component: TutuDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.tutu.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
