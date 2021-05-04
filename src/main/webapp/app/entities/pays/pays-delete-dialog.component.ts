import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPays } from 'app/shared/model/pays.model';
import { PaysService } from './pays.service';

@Component({
  templateUrl: './pays-delete-dialog.component.html',
})
export class PaysDeleteDialogComponent {
  pays?: IPays;

  constructor(protected paysService: PaysService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paysService.delete(id).subscribe(() => {
      this.eventManager.broadcast('paysListModification');
      this.activeModal.close();
    });
  }
}
