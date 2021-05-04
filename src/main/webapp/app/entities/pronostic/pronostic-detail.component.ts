import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPronostic } from 'app/shared/model/pronostic.model';

@Component({
  selector: 'jhi-pronostic-detail',
  templateUrl: './pronostic-detail.component.html',
})
export class PronosticDetailComponent implements OnInit {
  pronostic: IPronostic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pronostic }) => (this.pronostic = pronostic));
  }

  previousState(): void {
    window.history.back();
  }
}
