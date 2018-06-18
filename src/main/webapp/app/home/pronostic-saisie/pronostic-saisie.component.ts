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
  error: any;
  success: any;
  routeData: any;

  constructor(
      private pronosticSaisieService: PronosticSaisieService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      private principal: Principal

  ) {
      this.pronostics = [];
      this.itemsPerPage = 100;
      this.page = 0;
      this.links = {
          last: 0
      };
      this.predicate = 'id';
      this.reverse = true;
  }

  loadAll() {
      this.pronosticSaisieService.query({
          page: this.page,
          size: this.itemsPerPage
      }).subscribe(
          (res: HttpResponse<PronosticSaisie[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  valideProno(pronostic) {
    pronostic.updated = true;
       this.pronosticSaisieService.update(pronostic).subscribe(
        (response) => {
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
changeValidate(pronostic){
    pronostic.updated=false;
    console.log(pronostic);
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
  _keyPress(event: any) {
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
}

  private onSuccess(data, headers) {
      this.links = this.parseLinks.parse(headers.get('link'));
      this.totalItems = headers.get('X-Total-Count');
      for (let i = 0; i < data.length; i++) {
          console.log(data);
         this.pronostics.push(data[i]);
      }
  }

  private onError(error) {
      this.jhiAlertService.error(error.message, null, null);
  }

  private dateIsApres(date){
      var dateNow = new Date(Date.now());
      var dateD = new Date(date);
      return dateNow>dateD;
  }

}
