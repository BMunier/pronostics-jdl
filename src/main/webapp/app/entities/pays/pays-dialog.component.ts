import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Pays } from './pays.model';
import { PaysPopupService } from './pays-popup.service';
import { PaysService } from './pays.service';
import { Competition, CompetitionService } from '../competition';

@Component({
    selector: 'jhi-pays-dialog',
    templateUrl: './pays-dialog.component.html'
})
export class PaysDialogComponent implements OnInit {

    pays: Pays;
    isSaving: boolean;

    competitions: Competition[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private paysService: PaysService,
        private competitionService: CompetitionService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
        this.dataUtils.clearInputImage(this.pays, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.pays.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paysService.update(this.pays));
        } else {
            this.subscribeToSaveResponse(
                this.paysService.create(this.pays));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Pays>>) {
        result.subscribe((res: HttpResponse<Pays>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Pays) {
        this.eventManager.broadcast({ name: 'paysListModification', content: 'OK'});
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
    selector: 'jhi-pays-popup',
    template: ''
})
export class PaysPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paysPopupService: PaysPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paysPopupService
                    .open(PaysDialogComponent as Component, params['id']);
            } else {
                this.paysPopupService
                    .open(PaysDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
