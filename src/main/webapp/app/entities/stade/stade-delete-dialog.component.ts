import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Stade } from './stade.model';
import { StadePopupService } from './stade-popup.service';
import { StadeService } from './stade.service';

@Component({
    selector: 'jhi-stade-delete-dialog',
    templateUrl: './stade-delete-dialog.component.html'
})
export class StadeDeleteDialogComponent {

    stade: Stade;

    constructor(
        private stadeService: StadeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.stadeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'stadeListModification',
                content: 'Deleted an stade'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-stade-delete-popup',
    template: ''
})
export class StadeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stadePopupService: StadePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.stadePopupService
                .open(StadeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
