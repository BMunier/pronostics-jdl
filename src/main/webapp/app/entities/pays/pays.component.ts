import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPays } from 'app/shared/model/pays.model';
import { PaysService } from './pays.service';
import { PaysDeleteDialogComponent } from './pays-delete-dialog.component';

@Component({
  selector: 'jhi-pays',
  templateUrl: './pays.component.html',
})
export class PaysComponent implements OnInit, OnDestroy {
  pays?: IPays[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected paysService: PaysService,
    protected dataUtils: JhiDataUtils,
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
      this.paysService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IPays[]>) => (this.pays = res.body || []));
      return;
    }

    this.paysService.query().subscribe((res: HttpResponse<IPays[]>) => (this.pays = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPays();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPays): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInPays(): void {
    this.eventSubscriber = this.eventManager.subscribe('paysListModification', () => this.loadAll());
  }

  delete(pays: IPays): void {
    const modalRef = this.modalService.open(PaysDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pays = pays;
  }
}
