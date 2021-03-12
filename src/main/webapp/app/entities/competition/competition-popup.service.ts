import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Competition } from './competition.model';
import { CompetitionService } from './competition.service';

@Injectable()
export class CompetitionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private competitionService: CompetitionService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.competitionService.find(id)
                    .subscribe((competitionResponse: HttpResponse<Competition>) => {
                        const competition: Competition = competitionResponse.body;
                        if (competition.dateDebut) {
                            competition.dateDebut = {
                                year: competition.dateDebut.getFullYear(),
                                month: competition.dateDebut.getMonth() + 1,
                                day: competition.dateDebut.getDate()
                            };
                        }
                        if (competition.dateFin) {
                            competition.dateFin = {
                                year: competition.dateFin.getFullYear(),
                                month: competition.dateFin.getMonth() + 1,
                                day: competition.dateFin.getDate()
                            };
                        }
                        this.ngbModalRef = this.competitionModalRef(component, competition);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.competitionModalRef(component, new Competition());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    competitionModalRef(component: Component, competition: Competition): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.competition = competition;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
