import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import {Classement} from './classement.model';
import {ClassementService} from './classement.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
  selector: 'jhi-classement',
  templateUrl: './classement.component.html',
  styles: []
})
export class ClassementComponent implements OnInit {

  classements: Classement[];
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
  error: any;
  success: any;
  routeData: any;

  constructor(
      private classementService: ClassementService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      private principal: Principal

  ) {
      this.classements = [];
      this.itemsPerPage = 100;


  }
  loadAll() {
    this.classementService.query({
            size: this.itemsPerPage,
      }).subscribe(
        (res: HttpResponse<Classement[]>) => this.classements =res.body,
        (res: HttpErrorResponse) => this.onError(res.message)
    );
}
ngOnInit(){
  this.loadAll();
}

private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
}

}
