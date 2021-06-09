import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import {Classement} from './classement.model';
import {ClassementService} from './classement.service';
import { AccountService } from 'app/core/auth/account.service';
@Component({
  selector: 'jhi-classement',
  templateUrl: './classement.component.html',
  styles: []
})
export class ClassementComponent implements OnInit, OnChanges {
  @Input() competitionId: number;
  classements: Classement[];
  currentAccount: any;
  itemsPerPage: number;
  routeData: any;

  constructor(
      private classementService: ClassementService,
      private jhiAlertService: JhiAlertService,
      private eventManager: JhiEventManager,
      private parseLinks: JhiParseLinks,
      private activatedRoute: ActivatedRoute,
      private accountService: AccountService

  ) {
      this.classements = [];
      this.itemsPerPage = 100;
      this.competitionId = 15451;


  }
  loadAll(): void {
    this.classements = [];
    this.classementService.query(this.competitionId,
      {
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
getColor(username: any): string{
    if(username=== this.currentAccount.login){
      return "#C6F6A9";
    } else {
      return ""
    }

}
ngOnInit(): void {
  if(this.accountService.isAuthenticated()){
    this.accountService.getAuthenticationState().subscribe(account => (this.currentAccount = account));
  }
  this.loadAll();
}

ngOnChanges(): void {
  this.loadAll();
}

private onError(error: any): void {
    this.jhiAlertService.error(error.message, null, undefined);
}

}
