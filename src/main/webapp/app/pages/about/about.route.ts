import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AboutComponent } from './about.component';
import { RulesComponent } from './rules.component';
export const AboutRoute: Routes = [
    {
        path: 'about-about',
        component: AboutComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.about-about.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'about-rules',
        component: RulesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.about-rules.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
];
