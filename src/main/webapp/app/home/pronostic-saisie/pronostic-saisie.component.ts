import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import {PronosticSaisie} from './pronostic-saisie.model';
import {PronosticSaisieService} from './pronostic-saisie.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
  selector: 'jhi-pronostic-saisie',
  templateUrl: './pronostic-saisie.component.html',
  styles: []
})
export class PronosticSaisieComponent implements OnInit, OnDestroy {

  pronostics: PronosticSaisie[];
  currentAccount: any;
  eventSubscriber: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  queryCount: any;
  reverse: any;
  totalItems: number;
  currentSearch: string;

  constructor(
      private pronosticSaisieService: PronosticSaisieService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      private principal: Principal
  ) {
      this.pronostics = [];
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.page = 0;
      this.links = {
          last: 0
      };
      this.predicate = 'id';
      this.reverse = true;
      this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
          this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
      if (this.currentSearch) {
          this.pronosticSaisieService.search({
              query: this.currentSearch,
              page: this.page,
              size: this.itemsPerPage,
              sort: this.sort()
          }).subscribe(
              (res: HttpResponse<PronosticSaisie[]>) => this.onSuccess(res.body, res.headers),
              (res: HttpErrorResponse) => this.onError(res.message)
          );
          return;
      }
      this.pronosticSaisieService.query({
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
      }).subscribe(
          (res: HttpResponse<PronosticSaisie[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  reset() {
      this.page = 0;
      this.pronostics = [];
      this.loadAll();
  }

  loadPage(page) {
      this.page = page;
      this.loadAll();
  }

  clear() {
      this.pronostics = [];
      this.links = {
          last: 0
      };
      this.page = 0;
      this.predicate = 'id';
      this.reverse = true;
      this.currentSearch = '';
      this.loadAll();
  }

  search(query) {
      if (!query) {
          return this.clear();
      }
      this.pronostics = [];
      this.links = {
          last: 0
      };
      this.page = 0;
      this.predicate = '_score';
      this.reverse = false;
      this.currentSearch = query;
      this.loadAll();
  }
  ngOnInit() {
      this.loadAll();
      this.principal.identity().then((account) => {
          this.currentAccount = account;
      });
      this.registerChangeInPronostics();
  }

  ngOnDestroy() {
      this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: PronosticSaisie) {
      return item.id;
  }
  registerChangeInPronostics() {
      this.eventSubscriber = this.eventManager.subscribe('pronosticListModification', (response) => this.reset());
  }

  sort() {
      const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
      if (this.predicate !== 'id') {
          result.push('id');
      }
      return result;
  }

  private onSuccess(data, headers) {
      this.links = this.parseLinks.parse(headers.get('link'));
      this.totalItems = headers.get('X-Total-Count');
      for (let i = 0; i < data.length; i++) {
          this.pronostics.push(data[i]);
      }
  }

  private onError(error) {
      this.jhiAlertService.error(error.message, null, null);
  }

}
