import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Competition } from './competition.model';
import { CompetitionService } from './competition.service';

@Component({
    selector: 'jhi-competition-detail',
    templateUrl: './competition-detail.component.html'
})
export class CompetitionDetailComponent implements OnInit, OnDestroy {

    competition: Competition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private competitionService: CompetitionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompetitions();
    }

    load(id) {
        this.competitionService.find(id)
            .subscribe((competitionResponse: HttpResponse<Competition>) => {
                this.competition = competitionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompetitions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'competitionListModification',
            (response) => this.load(this.competition.id)
        );
    }
}
