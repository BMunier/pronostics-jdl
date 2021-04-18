import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPronostic } from 'app/shared/model/pronostic.model';
import { PronosticService } from './pronostic.service';

@Component({
  templateUrl: './pronostic-delete-dialog.component.html',
})
export class PronosticDeleteDialogComponent {
  pronostic?: IPronostic;

  constructor(protected pronosticService: PronosticService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pronosticService.delete(id).subscribe(() => {
      this.eventManager.broadcast('pronosticListModification');
      this.activeModal.close();
    });
  }
}
