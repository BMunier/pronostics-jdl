import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Pronostic } from './pronostic.model';
import { PronosticService } from './pronostic.service';

@Component({
    selector: 'jhi-pronostic-detail',
    templateUrl: './pronostic-detail.component.html'
})
export class PronosticDetailComponent implements OnInit, OnDestroy {

    pronostic: Pronostic;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private pronosticService: PronosticService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPronostics();
    }

    load(id) {
        this.pronosticService.find(id)
            .subscribe((pronosticResponse: HttpResponse<Pronostic>) => {
                this.pronostic = pronosticResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPronostics() {
        this.eventSubscriber = this.eventManager.subscribe(
            'pronosticListModification',
            (response) => this.load(this.pronostic.id)
        );
    }
}
