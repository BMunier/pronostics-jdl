import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { TotoComponent } from './toto.component';
import { TotoDetailComponent } from './toto-detail.component';
import { TotoPopupComponent } from './toto-dialog.component';
import { TotoDeletePopupComponent } from './toto-delete-dialog.component';

export const totoRoute: Routes = [
    {
        path: 'toto',
        component: TotoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.toto.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'toto/:id',
        component: TotoDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.toto.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const totoPopupRoute: Routes = [
    {
        path: 'toto-new',
        component: TotoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.toto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'toto/:id/edit',
        component: TotoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.toto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'toto/:id/delete',
        component: TotoDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.toto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
