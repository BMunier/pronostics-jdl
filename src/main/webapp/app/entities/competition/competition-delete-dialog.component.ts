import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Competition } from './competition.model';
import { CompetitionPopupService } from './competition-popup.service';
import { CompetitionService } from './competition.service';

@Component({
    selector: 'jhi-competition-delete-dialog',
    templateUrl: './competition-delete-dialog.component.html'
})
export class CompetitionDeleteDialogComponent {

    competition: Competition;

    constructor(
        private competitionService: CompetitionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.competitionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'competitionListModification',
                content: 'Deleted an competition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-competition-delete-popup',
    template: ''
})
export class CompetitionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private competitionPopupService: CompetitionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.competitionPopupService
                .open(CompetitionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
