import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Match } from './match.model';
import { MatchPopupService } from './match-popup.service';
import { MatchService } from './match.service';

@Component({
    selector: 'jhi-match-delete-dialog',
    templateUrl: './match-delete-dialog.component.html'
})
export class MatchDeleteDialogComponent {

    match: Match;

    constructor(
        private matchService: MatchService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.matchService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'matchListModification',
                content: 'Deleted an match'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-match-delete-popup',
    template: ''
})
export class MatchDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private matchPopupService: MatchPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.matchPopupService
                .open(MatchDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
