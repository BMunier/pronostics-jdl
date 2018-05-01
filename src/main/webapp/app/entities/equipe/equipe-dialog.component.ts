import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Equipe } from './equipe.model';
import { EquipePopupService } from './equipe-popup.service';
import { EquipeService } from './equipe.service';
import { Pays, PaysService } from '../pays';
import { Competition, CompetitionService } from '../competition';

@Component({
    selector: 'jhi-equipe-dialog',
    templateUrl: './equipe-dialog.component.html'
})
export class EquipeDialogComponent implements OnInit {

    equipe: Equipe;
    isSaving: boolean;

    pays: Pays[];

    competitions: Competition[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private equipeService: EquipeService,
        private paysService: PaysService,
        private competitionService: CompetitionService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.paysService
            .query({filter: 'equipe-is-null'})
            .subscribe((res: HttpResponse<Pays[]>) => {
                if (!this.equipe.pays || !this.equipe.pays.id) {
                    this.pays = res.body;
                } else {
                    this.paysService
                        .find(this.equipe.pays.id)
                        .subscribe((subRes: HttpResponse<Pays>) => {
                            this.pays = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.competitionService.query()
            .subscribe((res: HttpResponse<Competition[]>) => { this.competitions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.equipe, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.equipe.id !== undefined) {
            this.subscribeToSaveResponse(
                this.equipeService.update(this.equipe));
        } else {
            this.subscribeToSaveResponse(
                this.equipeService.create(this.equipe));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Equipe>>) {
        result.subscribe((res: HttpResponse<Equipe>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Equipe) {
        this.eventManager.broadcast({ name: 'equipeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackPaysById(index: number, item: Pays) {
        return item.id;
    }

    trackCompetitionById(index: number, item: Competition) {
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
    selector: 'jhi-equipe-popup',
    template: ''
})
export class EquipePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private equipePopupService: EquipePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.equipePopupService
                    .open(EquipeDialogComponent as Component, params['id']);
            } else {
                this.equipePopupService
                    .open(EquipeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
