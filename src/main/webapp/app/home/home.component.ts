import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { Competition, ICompetition } from 'app/shared/model/competition.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CompetitionService } from 'app/entities/competition/competition.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  listCompetition: Competition[] = [];
  competitionForm = this.formBuilder.group({
    competition: Competition
  });

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private formBuilder: FormBuilder,
    private competitionService: CompetitionService) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.loadCompetitions();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadCompetitions(): void {
    this.competitionService.query().subscribe((res: HttpResponse<ICompetition[]>) => (this.listCompetition = res.body || []));
  }
}
