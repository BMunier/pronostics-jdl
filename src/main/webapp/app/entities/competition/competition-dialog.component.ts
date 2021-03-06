import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Competition } from './competition.model';
import { CompetitionPopupService } from './competition-popup.service';
import { CompetitionService } from './competition.service';
import { Equipe, EquipeService } from '../equipe';
import { Pays, PaysService } from '../pays';
import { Stade, StadeService } from '../stade';

@Component({
    selector: 'jhi-competition-dialog',
    templateUrl: './competition-dialog.component.html'
})
export class CompetitionDialogComponent implements OnInit {

    competition: Competition;
    isSaving: boolean;

    equipes: Equipe[];

    pays: Pays[];

    stades: Stade[];
    dateDebutDp: any;
    dateFinDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private competitionService: CompetitionService,
        private equipeService: EquipeService,
        private paysService: PaysService,
        private stadeService: StadeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.equipeService.query()
            .subscribe((res: HttpResponse<Equipe[]>) => { this.equipes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.paysService.query()
            .subscribe((res: HttpResponse<Pays[]>) => { this.pays = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.stadeService.query()
            .subscribe((res: HttpResponse<Stade[]>) => { this.stades = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.competition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.competitionService.update(this.competition));
        } else {
            this.subscribeToSaveResponse(
                this.competitionService.create(this.competition));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Competition>>) {
        result.subscribe((res: HttpResponse<Competition>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Competition) {
        this.eventManager.broadcast({ name: 'competitionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackEquipeById(index: number, item: Equipe) {
        return item.id;
    }

    trackPaysById(index: number, item: Pays) {
        return item.id;
    }

    trackStadeById(index: number, item: Stade) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-competition-popup',
    template: ''
})
export class CompetitionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private competitionPopupService: CompetitionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.competitionPopupService
                    .open(CompetitionDialogComponent as Component, params['id']);
            } else {
                this.competitionPopupService
                    .open(CompetitionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
