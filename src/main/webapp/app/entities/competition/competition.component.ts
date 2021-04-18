import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompetition } from 'app/shared/model/competition.model';
import { CompetitionService } from './competition.service';
import { CompetitionDeleteDialogComponent } from './competition-delete-dialog.component';

@Component({
  selector: 'jhi-competition',
  templateUrl: './competition.component.html',
})
export class CompetitionComponent implements OnInit, OnDestroy {
  competitions?: ICompetition[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected competitionService: CompetitionService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.competitionService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<ICompetition[]>) => (this.competitions = res.body || []));
      return;
    }

    this.competitionService.query().subscribe((res: HttpResponse<ICompetition[]>) => (this.competitions = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCompetitions();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICompetition): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCompetitions(): void {
    this.eventSubscriber = this.eventManager.subscribe('competitionListModification', () => this.loadAll());
  }

  delete(competition: ICompetition): void {
    const modalRef = this.modalService.open(CompetitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.competition = competition;
  }
}
