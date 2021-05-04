import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import {Classement} from './classement.model';
import {ClassementService} from './classement.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-classement',
  templateUrl: './classement.component.html',
  styles: []
})
export class ClassementComponent implements OnInit {

  classements: Classement[];
  currentAccount: any;
  // eventSubscriber: Subscription;
  itemsPerPage: number;
  routeData: any;

  constructor(
      private classementService: ClassementService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      // private principal: Principal

  ) {
      this.classements = [];
      this.itemsPerPage = 100;


  }
  loadAll(): void {
    this.classementService.query({
            size: this.itemsPerPage,
      }).subscribe(
        (res: HttpResponse<Classement[]>) => {
          if(res.body){
            this.classements =res.body
        }
      },
        (res: HttpErrorResponse) => this.onError(res.message)
    );
}
getColor(idUtilisateur: any): string{
    if(idUtilisateur=== this.currentAccount.id){
      return "#C6F6A9";
    } else {
      return ""
    }

}
ngOnInit(): void{
/*     this.principal.identity().then((account: any) => {
        console.log(account);
        this.currentAccount = account;
    }); */
  this.loadAll();
}

private onError(error: any): void {
    this.jhiAlertService.error(error.message, null, undefined);
}

}
