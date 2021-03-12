import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Stade } from './stade.model';
import { StadeService } from './stade.service';

@Component({
    selector: 'jhi-stade-detail',
    templateUrl: './stade-detail.component.html'
})
export class StadeDetailComponent implements OnInit, OnDestroy {

    stade: Stade;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private stadeService: StadeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInStades();
    }

    load(id) {
        this.stadeService.find(id)
            .subscribe((stadeResponse: HttpResponse<Stade>) => {
                this.stade = stadeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInStades() {
        this.eventSubscriber = this.eventManager.subscribe(
            'stadeListModification',
            (response) => this.load(this.stade.id)
        );
    }
}
