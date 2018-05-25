import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Match } from './match.model';
import { MatchPopupService } from './match-popup.service';
import { MatchService } from './match.service';
import { Competition, CompetitionService } from '../competition';
import { Stade, StadeService } from '../stade';
import { Equipe, EquipeService } from '../equipe';

@Component({
    selector: 'jhi-match-dialog',
    templateUrl: './match-dialog.component.html'
})
export class MatchDialogComponent implements OnInit {

    match: Match;
    isSaving: boolean;

    competitions: Competition[];

    stades: Stade[];

    equipes: Equipe[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private matchService: MatchService,
        private competitionService: CompetitionService,
        private stadeService: StadeService,
        private equipeService: EquipeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.competitionService.query()
            .subscribe((res: HttpResponse<Competition[]>) => { this.competitions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.stadeService.query()
            .subscribe((res: HttpResponse<Stade[]>) => { this.stades = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.equipeService.query()
            .subscribe((res: HttpResponse<Equipe[]>) => { this.equipes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.match.id !== undefined) {
            this.subscribeToSaveResponse(
                this.matchService.update(this.match));
        } else {
            this.subscribeToSaveResponse(
                this.matchService.create(this.match));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Match>>) {
        result.subscribe((res: HttpResponse<Match>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Match) {
        this.eventManager.broadcast({ name: 'matchListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCompetitionById(index: number, item: Competition) {
        return item.id;
    }

    trackStadeById(index: number, item: Stade) {
        return item.id;
    }

    trackEquipeById(index: number, item: Equipe) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-match-popup',
    template: ''
})
export class MatchPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private matchPopupService: MatchPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.matchPopupService
                    .open(MatchDialogComponent as Component, params['id']);
            } else {
                this.matchPopupService
                    .open(MatchDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
