import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IEquipe } from 'app/shared/model/equipe.model';

@Component({
  selector: 'jhi-equipe-detail',
  templateUrl: './equipe-detail.component.html',
})
export class EquipeDetailComponent implements OnInit {
  equipe: IEquipe | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipe }) => (this.equipe = equipe));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
