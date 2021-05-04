import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStade } from 'app/shared/model/stade.model';

@Component({
  selector: 'jhi-stade-detail',
  templateUrl: './stade-detail.component.html',
})
export class StadeDetailComponent implements OnInit {
  stade: IStade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stade }) => (this.stade = stade));
  }

  previousState(): void {
    window.history.back();
  }
}
