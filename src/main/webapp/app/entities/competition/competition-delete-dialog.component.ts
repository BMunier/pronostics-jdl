import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICompetition } from 'app/shared/model/competition.model';
import { CompetitionService } from './competition.service';

@Component({
  templateUrl: './competition-delete-dialog.component.html',
})
export class CompetitionDeleteDialogComponent {
  competition?: ICompetition;

  constructor(
    protected competitionService: CompetitionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.competitionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('competitionListModification');
      this.activeModal.close();
    });
  }
}
