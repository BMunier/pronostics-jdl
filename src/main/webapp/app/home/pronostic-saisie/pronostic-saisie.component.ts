import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import {PronosticSaisie} from './pronostic-saisie.model';
import {PronosticSaisieService} from './pronostic-saisie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-pronostic-saisie',
  templateUrl: './pronostic-saisie.component.html',
  styles: []
})
export class PronosticSaisieComponent implements OnInit, OnDestroy, OnChanges {
  @Input() competitionId: number;
  pronostics: PronosticSaisie[];
  currentAccount: any;
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  queryCount: any;
  reverse: any;
  totalItems: number;
  error: any;
  success: any;
  routeData: any;

  constructor(
      private pronosticSaisieService: PronosticSaisieService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      // private principal: Principal

  ) {
      this.pronostics = [];
      this.itemsPerPage = 100;
      this.page = 0;
      this.links = {
          last: 0
      };
      this.predicate = 'id';
      this.reverse = true;
      this.totalItems = 0;
      this.competitionId = 15451;
  }

  loadAll(): void {
    this.pronostics = [];
    this.pronosticSaisieService.queryForCompetitionId(this.competitionId, {
        page: this.page,
        size: this.itemsPerPage
    }).subscribe(
        (res: HttpResponse<PronosticSaisie[]>) => {
          this.onSuccess(res.body, res.headers)
        },
        (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  valideProno(pronostic: any): void {
    pronostic.updated = true;
        this.pronosticSaisieService.update(pronostic).subscribe(
        (response: any) => {
            pronostic.id=response.body.id;

            if (response.status === 200) {
                this.error = null;
                this.success = 'OK';
                pronostic.updated = true;
                // this.reset();
            } else {
                this.success = null;
                this.error = 'ERROR';
            }
        });
  }

  changeValidate(pronostic: any): void {
      pronostic.updated=false;
  }

  reset(): void {
      this.page = 0;
      this.pronostics = [];
      this.loadAll();
  }

  loadPage(page: any): void {
      this.page = page;
      this.loadAll();
  }

  clear(): void {
      this.pronostics = [];
      this.links = {
          last: 0
      };
      this.page = 0;
      this.predicate = 'id';
      this.reverse = true;
      this.loadAll();
  }

  search(query: any): void {
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
      this.loadAll();
  }
  ngOnInit(): void {
      this.loadAll();
/*       this.principal.identity().then((account: any) => {
          this.currentAccount = account;
      }); */
      this.registerChangeInPronostics();
  }

  ngOnChanges(): void {
    // We call clear() to clear the table and reload the pronostics for the selected competition
    this.clear();
  }

  ngOnDestroy(): void {
    if(this.eventSubscriber){
      this.eventManager.destroy(this.eventSubscriber)
    };
  }

  trackId(index: number, item: PronosticSaisie): any {
      return item?.id;
  }
  registerChangeInPronostics(): void {
      this.eventSubscriber = this.eventManager.subscribe('pronosticListModification', (response: any) => this.reset());
  }
  _keyPress(event: any): void {
    const pattern = /[0-9+ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
}

  private onSuccess(data: any, headers: any): void {
    this.pronostics = [];
      this.links = this.parseLinks.parse(headers.get('link'));
      this.totalItems = headers.get('X-Total-Count');
      for (let i = 0; i < data.length; i++) {
         this.pronostics.push(data[i]);
      }
  }

  private onError(error: any): void {
      this.jhiAlertService.error(error.message, null, undefined);
  }

  dateIsApres(date: any): boolean{
      const dateNow = new Date(Date.now());
      const dateD = new Date(date);
      return dateNow>dateD;
  }

}
