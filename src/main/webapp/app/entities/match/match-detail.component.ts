import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Match } from './match.model';
import { MatchService } from './match.service';

@Component({
    selector: 'jhi-match-detail',
    templateUrl: './match-detail.component.html'
})
export class MatchDetailComponent implements OnInit, OnDestroy {

    match: Match;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private matchService: MatchService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMatches();
    }

    load(id) {
        this.matchService.find(id)
            .subscribe((matchResponse: HttpResponse<Match>) => {
                this.match = matchResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMatches() {
        this.eventSubscriber = this.eventManager.subscribe(
            'matchListModification',
            (response) => this.load(this.match.id)
        );
    }
}
